"use server";

import { geminiContextChannel, geminiStatusChannel } from "@/inngest/channels/gemini";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type GeminiStatusChannelToken = Realtime.Token<typeof geminiStatusChannel, ["status"]>;

export async function fetchGeminiStatusRealtimeToken(): Promise<GeminiStatusChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: geminiStatusChannel(),
        topics: ["status"],
    });

    return token;
}

export type geminiContextChannelToken = Realtime.Token<typeof geminiContextChannel, ["context"]>;

export async function fetchGeminiContextRealtimeToken(): Promise<geminiContextChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: geminiContextChannel(),
        topics: ["context"],
    });

    return token;
}