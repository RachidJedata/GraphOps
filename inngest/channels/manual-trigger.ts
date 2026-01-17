import { channel, topic } from "@inngest/realtime";
import z from "zod";


export const MANUAL_TRIGGER_CHANNEL_NAME = "manual-trigger";

export const manualTriggerChannel = channel(MANUAL_TRIGGER_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
            })
        ),
    );
