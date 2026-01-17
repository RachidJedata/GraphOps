"use server";

import { stripeChannel } from "@/inngest/channels/stripe";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type StripeDataChannelToken = Realtime.Token<typeof stripeChannel, ["status"]>;

export async function fetchStripeRealtimeToken(): Promise<StripeDataChannelToken> {
    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: stripeChannel(),
        topics: ["status"],
    });

    return token;
}