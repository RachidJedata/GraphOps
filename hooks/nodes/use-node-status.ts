import { useInngestSubscription } from "@inngest/realtime/hooks";
import type { Realtime } from "@inngest/realtime";
import { useEffect, useState } from "react";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";

type UseNodeStatusOptions = {
    nodeId: string;
    channel: string;
    topic: string;
    refreshToken: () => Promise<Realtime.Subscribe.Token>;
};


export function useNodeStatus({
    channel,
    nodeId,
    refreshToken,
    topic,
}: UseNodeStatusOptions) {
    const [status, setStatus] = useState<NodeStatus>("initial");

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
            message.data?.nodeId !== nodeId
        ) {
            return;
        }

        setStatus(message.data.status as NodeStatus);
    }, [latestData, channel, topic, nodeId]);

    useEffect(() => {
        if (error) {
            setStatus("error");
        }
    }, [error]);


    return status;
}
