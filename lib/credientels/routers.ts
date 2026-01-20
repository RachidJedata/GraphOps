import prisma from '@/lib/db';
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import { PAGINATION } from '../constants';
import { CredientielType } from '../generated/prisma/enums';
import { encrypt } from '../encryption';

export const credentielRouters = createTRPCRouter({
    create: premiumProcedure
        .input(z.object({
            name: z.string().min(1, "credentiel name is required"),
            value: z.string().min(1, "credentiel value is required"),
            type: z.enum(CredientielType),
        }))
        .mutation((
            { ctx, input }
        ) => {
            const encryptedValue = encrypt(input.value);

            return prisma.credientiels.create({
                data: {
                    name: input.name,
                    type: input.type,
                    value: encryptedValue,
                    userId: ctx.auth.user.id,
                }
            })
        }),
    remove: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "credentiel Id is required"),
        }))
        .mutation((
            { ctx, input }
        ) => {
            return prisma.credientiels.delete({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                }
            })
        }),
    update: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "credentiel id is required"),
            name: z.string().min(1, "credentiel name is required"),
            value: z.string().optional(),
            type: z.enum(CredientielType),
        }))
        .mutation((
            { ctx, input }
        ) => {
            const { id, name, type, value } = input;
            return prisma.credientiels.update({
                data: {
                    name,
                    type,
                    ...(value && { value })
                },
                where: {
                    id: id,
                    userId: ctx.auth.user.id,
                }
            });
        }),
    getOne: protectedProcedure
        .input(z.object({
            id: z.string().min(1, "credentiel id is required"),
        }))
        .query((
            { input, ctx }
        ) => {
            return prisma.credientiels.findUniqueOrThrow({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
                omit: {
                    value: true,
                },
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
                prisma.credientiels.findMany({
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        }
                    },
                    omit: {
                        value: true,
                    },
                    take: pageSize,
                    skip: (page - 1) * pageSize,
                    orderBy: {
                        updatedAt: "desc",
                    }
                }),
                prisma.credientiels.count({
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
    getByType: protectedProcedure
        .input(z.object({
            type: z.enum(CredientielType),
        }))
        .query((
            { input, ctx }
        ) => {
            return prisma.credientiels.findMany({
                where: {
                    userId: ctx.auth.user.id,
                    type: input.type,
                },
                omit: {
                    value: true,
                },
                orderBy: {
                    updatedAt: "desc"
                }
            });
        }),
});