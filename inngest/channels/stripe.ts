import { channel, topic } from "@inngest/realtime";
import z from "zod";


export const STRIPE_CHANNEL_NAME = "stripe-trigger";

export const stripeChannel = channel(STRIPE_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
            })
        ),
    );
