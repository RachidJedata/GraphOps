"use server";

import { anthropicContextChannel, anthropicStatusChannel } from "@/inngest/channels/anthropic";
import { geminiContextChannel, geminiStatusChannel } from "@/inngest/channels/gemini";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type AnthropicStatusChannelToken = Realtime.Token<typeof anthropicStatusChannel, ["status"]>;

export async function fetchAnthropicStatusRealtimeToken(): Promise<AnthropicStatusChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: anthropicStatusChannel(),
        topics: ["status"],
    });

    return token;
}

export type AnthropicContextChannelToken = Realtime.Token<typeof anthropicContextChannel, ["context"]>;

export async function fetchAnthropicContextRealtimeToken(): Promise<AnthropicContextChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: anthropicContextChannel(),
        topics: ["context"],
    });

    return token;
}