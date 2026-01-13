import { generateSlug } from 'random-word-slugs'
import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import { PAGINATION } from '../constants';

export const workFlowRouters = createTRPCRouter({
    create: protectedProcedure
        .mutation((
            { ctx }
        ) => {
            return prisma.workFlow.create({
                data: {
                    name: generateSlug(2),
                    userId: ctx.auth.user.id
                }
            })
        }),
    remove: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "WorkFlow Id is required"),
        }))
        .mutation((
            { ctx, input }
        ) => {
            return prisma.workFlow.delete({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                }
            })
        }),
    updateName: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "WorkFlow Id is required"),
            name: z.string().min(1, "WorkFlow name is required"),
        }))
        .mutation((
            { ctx, input }
        ) => {
            return prisma.workFlow.update({
                data: {
                    name: input.name,
                },
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                }
            })
        }),
    getOne: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "WorkFlow Id is required"),
        }))
        .query((
            { input, ctx }
        ) => {
            return prisma.workFlow.findUnique({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                }
            });
        }),
    getMany: protectedProcedure
        .input(z.object({
            search: z.string().default(""),
            page: z.number().default(PAGINATION.DEFAULT_PAGE),
            pageSize: z.number()
                .min(PAGINATION.MIN_PAGE_SIZE)
                .max(PAGINATION.MAX_PAGE_SIZE)
                .default(PAGINATION.DEFAULT_PAGE_SIZE)
        }))
        .query(async (
            { ctx, input }
        ) => {
            const { page, pageSize, search } = input;
            const [items, totalCount] = await Promise.all([
                prisma.workFlow.findMany({
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        }
                    },
                    take: pageSize,
                    skip: (page - 1) * pageSize,
                    orderBy: {
                        updatedAt: "desc",
                    }
                }),
                prisma.workFlow.count({
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        }
                    },
                }),
            ]);

            const totalPages = Math.ceil(totalCount / pageSize);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return {
                items,
                page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            }
        }),
});