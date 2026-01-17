"use server";

import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type manualTriggerChannelToken = Realtime.Token<typeof manualTriggerChannel, ["status"]>;

export async function fetchManualTriggerRealtimeToken(): Promise<manualTriggerChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: manualTriggerChannel(),
        topics: ["status"],
    });

    return token;
}