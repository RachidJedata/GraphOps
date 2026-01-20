import { generateSlug } from 'random-word-slugs'
import prisma from '@/lib/db';
import { createTRPCRouter, premiumProcedure, protectedProcedure } from '@/trpc/init';
import z from 'zod';
import { PAGINATION } from '../constants';
import { NodeType } from '../generated/prisma/enums';
import { Node as NodeFlow, Edge as flowEdge } from '@xyflow/react';
import { sendWorkFlowExecution } from '@/inngest/utils';

export const workFlowRouters = createTRPCRouter({
    execute: premiumProcedure
        .input(z.object({
            id: z.string().min(1, "WorkFlow Id is required"),
        }))
        .mutation(async ({ ctx, input }) => {
            await sendWorkFlowExecution({ workflowId: input.id });
        }),
    create: premiumProcedure
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
    update: premiumProcedure
        .input(z.object({
            id: z.string().min(1, "WorkFlow Id is required"),
            nodes: z.array(z.object({
                id: z.string(),
                type: z.string().nullish(),
                position: z.object({
                    x: z.number(),
                    y: z.number(),
                }),
                data: z.record(z.string(), z.any()).optional(),
            })),
            edges: z.array(z.object({
                id: z.string(),
                source: z.string(),
                sourceHandle: z.string().nullish(),

                target: z.string(),
                targetHandle: z.string().nullish(),
            })),
        }))
        .mutation(async (
            { ctx, input }
        ) => {
            const { id, edges, nodes } = input;
            const workflow = await prisma.workFlow.findFirstOrThrow({
                where: {
                    id: id,
                    userId: ctx.auth.user.id,
                }
            });

            // use transcation to ensure data integrity
            return await prisma.$transaction(async (tx) => {

                // delete existing nodes 
                // connections will be deleted automatically due to cascade delete
                await tx.node.deleteMany({
                    where: {
                        workFlowId: workflow.id,
                    }
                });
                //Create new nodes
                await tx.node.createMany({
                    data: nodes.map(node => ({
                        id: node.id,
                        name: node.type || NodeType.INITIAL,
                        type: node.type as NodeType || NodeType.INITIAL,
                        position: node.position,
                        data: node.data || {},
                        workFlowId: workflow.id,
                    })),
                });

                //create new connections
                await tx.connection.createMany({
                    data: edges.map(edge => ({
                        id: edge.id,
                        fromNodeId: edge.source,
                        fromOutput: edge.sourceHandle || "main",

                        toNodeId: edge.target,
                        toInput: edge.targetHandle || "main",
                        workFlowId: workflow.id,
                    })),
                });

                //update workflow's updatedAt for better experience in listing
                return await tx.workFlow.update({
                    where: {
                        id: workflow.id,
                    },
                    data: {
                        updatedAt: new Date(),
                    }
                });
            });
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