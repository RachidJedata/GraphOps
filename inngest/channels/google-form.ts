import { channel, topic } from "@inngest/realtime";
import z from "zod";


export const GOOGLE_FORM_CHANNEL_NAME = "google-form-trigger";

export const googleFormChannel = channel(GOOGLE_FORM_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
            })
        ),
    );
