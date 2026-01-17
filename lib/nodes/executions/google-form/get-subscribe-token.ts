"use server";

import { googleFormChannel } from "@/inngest/channels/google-form";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type GoogleFormDataChannelToken = Realtime.Token<typeof googleFormChannel, ["status"]>;

export async function fetchGoogleFormDataRealtimeToken(): Promise<GoogleFormDataChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: googleFormChannel(),
        topics: ["status"],
    });

    return token;
}