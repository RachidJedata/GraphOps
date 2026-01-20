import { channel, topic } from "@inngest/realtime";
import z from "zod";


export const SLACK_STATUS_CHANNEL_NAME = "slack-status-execution";

export const slackStatusChannel = channel(SLACK_STATUS_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
            })
        ),
    );

export const SLACK_CONTEXT_CHANNEL_NAME = "slack-context-execution";
export const slackContextChannel = channel(SLACK_CONTEXT_CHANNEL_NAME)
    .addTopic(
        topic("context").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                dataType: z.enum(["inputData", "outputData"]),
                data: z.any(),
            })
        ),
    );
