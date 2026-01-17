"use server";

import { httpRequestChannel } from "@/inngest/channels/http-request";
import { inngest } from "@/inngest/client";
import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export type httpRequestChannelToken = Realtime.Token<typeof httpRequestChannel, ["status"]>;

export async function fetchHttpRequestRealtimeToken(): Promise<httpRequestChannelToken> {

    // const session = await auth.api.getSession({
    //     headers: await headers(),
    // });
    // const userId = session?.user.id;

    // This creates a token using the Inngest API that is bound to the channel and topic:
    const token = await getSubscriptionToken(inngest, {
        channel: httpRequestChannel(),
        topics: ["status"],
    });

    return token;
}