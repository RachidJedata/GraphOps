import { channel, topic } from "@inngest/realtime";
import z from "zod";


export const OPENAI_STATUS_CHANNEL_NAME = "openai-status-execution";

export const openAIStatusChannel = channel(OPENAI_STATUS_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
                error: z.string().optional(),
            })
        ),
    );

export const OPENAI_CONTEXT_CHANNEL_NAME = "openai-context-execution";
export const openAIContextChannel = channel(OPENAI_CONTEXT_CHANNEL_NAME)
    .addTopic(
        topic("context").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                dataType: z.enum(["inputData", "outputData"]),
                data: z.any(),
            })
        ),
    );
