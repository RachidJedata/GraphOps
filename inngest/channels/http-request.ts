import { channel, topic } from "@inngest/realtime";
import z from "zod";


/**
 * Channel for handling HTTP request execution events.
 * 
 * @remarks
 * This channel manages status updates for HTTP requests, tracking the execution state of individual nodes.
 * 
 * @topic status - Publishes node status updates
 * @topicType {{nodeId: string, status: Omit<NodeStatus, "initial">}} - Status payload containing the node identifier and its current status (excluding initial state)
 */
export const HTTP_REQUEST_CHANNEL_NAME = "http-request-execution";

export const httpRequestChannel = channel(HTTP_REQUEST_CHANNEL_NAME)
    .addTopic(
        topic("status").schema(
            z.object({
                nodeId: z.string().min(1, "Node Id is required"),
                status: z.enum(["loading", "success", "error"]),
            })
        ),
    );
