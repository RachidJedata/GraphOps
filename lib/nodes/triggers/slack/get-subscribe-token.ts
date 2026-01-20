"use server";

import { slackContextChannel, slackStatusChannel } from "@/inngest/channels/slack";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type SlackStatusChannelToken = Realtime.Token<typeof slackStatusChannel, ["status"]>;

export async function fetchSlackStatusRealtimeToken(): Promise<SlackStatusChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: slackStatusChannel(),
        topics: ["status"],
    });

    return token;
}

export type SlackContextChannelToken = Realtime.Token<typeof slackContextChannel, ["context"]>;

export async function fetchSlackContextRealtimeToken(): Promise<SlackContextChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: slackContextChannel(),
        topics: ["context"],
    });

    return token;
}