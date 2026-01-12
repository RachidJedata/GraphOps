import { generateSlug } from 'random-word-slugs'
import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import z from 'zod';

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
        .query((
            { ctx }
        ) => {
            return prisma.workFlow.findMany({
                where: {
                    userId: ctx.auth.user.id,
                }
            });
        }),
});