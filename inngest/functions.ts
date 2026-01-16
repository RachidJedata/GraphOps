import { inngest } from "./client";
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'
import { NonRetriableError } from "inngest";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { getNodeExecutor } from "@/lib/executions/executor-registory";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const executeAI = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {

        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google("gemini-2.5-flash"),
                system: "",
                prompt: "",
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        )

        return steps;
    },
);

export const executeWorkFlow = inngest.createFunction(
    { id: "execute-workflow" },
    { event: "workflows/execute" },
    async ({ event, step }) => {
        const { workflowId } = event.data;

        if (!workflowId) throw new NonRetriableError("Workflow ID is required");

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


        //Initialize context to pass between nodes
        let context = event.data.initialData || {};

        // Execute each node in topological order
        for (const node of sortedNodes) {
            const executor = getNodeExecutor(node.type);

            context = await executor({
                data: node.data as Record<string, unknown>,
                nodeId: node.id,
                context,
                step,
            });
        }

        return {
            workflowId,
            result: context,

        };
    },
);


