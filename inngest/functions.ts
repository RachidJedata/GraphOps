import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { getNodeExecutor } from "@/lib/executor-registory";


export const executeWorkFlow = inngest.createFunction(
    {
        id: "execute-workflow",
        retries: 0,
        onFailure: async ({ step, error, event }) => {
            await step.run("update-execution", async () => {
                await prisma.execution.update({
                    where: {
                        inngestEventId: event.data.event.id,
                    },
                    data: {
                        status: "FAILED",
                        completedAt: null,
                        error: error.message,
                        errorStack: error.stack,
                    }
                });
            });
        },
    },
    { event: "workflows/execute" },
    async ({ event, step, publish }) => {
        const { workflowId, initialData } = event.data;
        const eventId = event.id;

        if (!eventId || !workflowId) throw new NonRetriableError("Workflow ID sor event ID is missing");

        await step.run("create-execution", async () => {
            await prisma.execution.create({
                data: {
                    inngestEventId: eventId,
                    workflowId,
                }
            });
        });

        const sortedNodes = await step.run("prepare-workflow", async () => {
            // Fetch from workflow to include 
            const workflow = await prisma.workFlow.findFirstOrThrow({
                where: { id: workflowId },
                include: {
                    nodes: true,
                    connections: true,
                }
            });

            return topologicalSort(workflow.nodes, workflow.connections);
        });

        const userId = await step.run("find-user-id", async () => {
            const workFlow = await prisma.workFlow.findUniqueOrThrow({
                where: {
                    id: workflowId,
                },
                select: {
                    userId: true
                }
            })
            return workFlow.userId;
        })

        //Initialize context to pass between nodes
        let context = initialData || {};

        // Execute each node in topological order
        for (const node of sortedNodes) {
            const executor = getNodeExecutor(node.type);

            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeId: node.id,
                context,
                userId,
                step,
                publish,
            });
        }

        await step.run("update-execution", async () => {
            await prisma.execution.update({
                where: {
                    inngestEventId: eventId,
                    workflowId
                },
                data: {
                    status: "SUCCESS",
                    completedAt: new Date(Date.now()),
                    output: context,
                }
            });
        });

        return {
            workflowId,
            result: context,
        };
    },
);


