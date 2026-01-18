import { channel, topic } from "@inngest/realtime";
import z from "zod";


export const GEMINI_STATUS_CHANNEL_NAME = "gemini-status-execution";

export const geminiStatusChannel = channel(GEMINI_STATUS_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
            })
        ),
    );

export const GEMINI_CONTEXT_CHANNEL_NAME = "gemini-context-execution";
export const geminiContextChannel = channel(GEMINI_CONTEXT_CHANNEL_NAME)
    .addTopic(
        topic("context").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                dataType: z.enum(["inputData", "outputData"]),
                data: z.any(),
            })
        ),
    );
