import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
    getWorkFlows: protectedProcedure
        .query(({ ctx }) => {
            return prisma.workFlow.findMany();
        }),
    createWorkFlow: protectedProcedure
        .input(z.object({
            name: z.string().min(1, "name is required")
        }))
        .mutation((
            { input }
        ) => {
            return prisma.workFlow.create({
                data: {
                    name: input.name,
                }
            })
        })
});
// export type definition of API
export type AppRouter = typeof appRouter;