import { channel, topic } from "@inngest/realtime";
import z from "zod";


export const DISCORD_STATUS_CHANNEL_NAME = "discord-status-execution";

export const discordStatusChannel = channel(DISCORD_STATUS_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
            })
        ),
    );

export const DISCORD_CONTEXT_CHANNEL_NAME = "discord-context-execution";
export const discordContextChannel = channel(DISCORD_CONTEXT_CHANNEL_NAME)
    .addTopic(
        topic("context").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                dataType: z.enum(["inputData", "outputData"]),
                data: z.any(),
            })
        ),
    );
