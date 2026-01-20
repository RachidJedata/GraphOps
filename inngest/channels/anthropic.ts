import { channel, topic } from "@inngest/realtime";
import z from "zod";


export const ANTHROPIC_STATUS_CHANNEL_NAME = "anthropic-status-execution";

export const anthropicStatusChannel = channel(ANTHROPIC_STATUS_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
                error: z.string().optional(),
            })
        ),
    );

export const ANTHROPIC_CONTEXT_CHANNEL_NAME = "anthropic-context-execution";
export const anthropicContextChannel = channel(ANTHROPIC_CONTEXT_CHANNEL_NAME)
    .addTopic(
        topic("context").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                dataType: z.enum(["inputData", "outputData"]),
                data: z.any(),
            })
        ),
    );
