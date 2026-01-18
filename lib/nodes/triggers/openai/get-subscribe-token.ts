"use server";

import { openAIContextChannel, openAIStatusChannel } from "@/inngest/channels/openai";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type OpenaAIStatusChannelToken = Realtime.Token<typeof openAIStatusChannel, ["status"]>;

export async function fetchOpenAIStatusRealtimeToken(): Promise<OpenaAIStatusChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: openAIStatusChannel(),
        topics: ["status"],
    });

    return token;
}

export type OpenAIContextChannelToken = Realtime.Token<typeof openAIContextChannel, ["context"]>;

export async function fetchOpenAIContextRealtimeToken(): Promise<OpenAIContextChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: openAIContextChannel(),
        topics: ["context"],
    });

    return token;
}