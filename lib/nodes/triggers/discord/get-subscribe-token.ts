"use server";

import { discordContextChannel, discordStatusChannel } from "@/inngest/channels/discord";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type DiscordStatusChannelToken = Realtime.Token<typeof discordStatusChannel, ["status"]>;

export async function fetchDiscordStatusRealtimeToken(): Promise<DiscordStatusChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: discordStatusChannel(),
        topics: ["status"],
    });

    return token;
}

export type DiscordContextChannelToken = Realtime.Token<typeof discordContextChannel, ["context"]>;

export async function fetchDiscordContextRealtimeToken(): Promise<DiscordContextChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: discordContextChannel(),
        topics: ["context"],
    });

    return token;
}