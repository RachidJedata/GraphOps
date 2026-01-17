import { useInngestSubscription } from "@inngest/realtime/hooks";
import type { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

type UseNodeContextOptions = {
    dataType: "inputData" | "outputData";
    nodeId: string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<Realtime.Subscribe.Token>;
};


export function useNodeContext({
    channel,
    nodeId,
    refreshToken,
    topic,
    dataType,
}: UseNodeContextOptions) {

    const [context, setContext] = useState<any | undefined>(undefined);

    const {
        data,
        latestData,
        freshData,
        error,
        state,
    } = useInngestSubscription({
        refreshToken,
        enabled: true,
    });

    useEffect(() => {
        if (!latestData) return;

        const message = latestData;

        // Ensure message is relevant
        if (
            message.channel !== channel ||
            message.topic !== topic ||
            message.data?.nodeId !== nodeId ||
            message.data?.dataType !== dataType
        ) {
            return;
        }

        setContext(message.data.data);
    }, [latestData, channel, topic, nodeId]);

    return context;
}
