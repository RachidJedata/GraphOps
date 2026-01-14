import { generateSlug } from 'random-word-slugs'
import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import { PAGINATION } from '../constants';
import { NodeType } from '../generated/prisma/enums';
import { Node as NodeFlow, Edge as flowEdge } from '@xyflow/react';

export const workFlowRouters = createTRPCRouter({
    create: protectedProcedure
        .mutation((
            { ctx }
        ) => {
            return prisma.workFlow.create({
                data: {
                    name: generateSlug(2),
                    userId: ctx.auth.user.id,
                    nodes: {
                        create: {
                            name: NodeType.INITIAL,
                            position: { x: 0, y: 0 },
                            type: NodeType.INITIAL,
                        }
                    }
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
        .query(async (
            { input, ctx }
        ) => {
            const workFlow = await prisma.workFlow.findUniqueOrThrow({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
                include: {
                    nodes: true,
                    connections: true,
                }
            });

            // transform nodes and connections to be compatible with react-flow
            const nodes: NodeFlow[] = workFlow.nodes.map(node => ({
                id: node.id,
                position: node.position as { x: number, y: number },
                data: node.data as Record<string, unknown> || {},
                type: node.type,
            }));

            const edges: flowEdge[] = workFlow.connections.map(connection => ({
                id: connection.id,
                source: connection.fromNodeId,
                sourceHandle: connection.fromOutput,

                target: connection.toNodeId,
                targetHandle: connection.toInput,
            }));

            return {
                id: workFlow.id,
                name: workFlow.name,
                nodes,
                edges
            };
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