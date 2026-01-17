"use server";

import { httpRequestContextChannel, httpRequestStatusChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type httpRequestStatusChannelToken = Realtime.Token<typeof httpRequestStatusChannel, ["status"]>;

export async function fetchHttpRequestStatusRealtimeToken(): Promise<httpRequestStatusChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: httpRequestStatusChannel(),
        topics: ["status"],
    });

    return token;
}

export type httpRequestContextChannelToken = Realtime.Token<typeof httpRequestContextChannel, ["context"]>;

export async function fetchHttpRequestContextRealtimeToken(): Promise<httpRequestContextChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: httpRequestContextChannel(),
        topics: ["context"],
    });

    return token;
}