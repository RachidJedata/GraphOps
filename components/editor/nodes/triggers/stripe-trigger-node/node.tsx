"use client";

import { BaseTriggerNode } from "../../base-nodes/base-trigger-node";
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import StripeTriggerDialog from "./dialog";
import { STRIPE_CHANNEL_NAME } from "@/inngest/channels/stripe";
import { fetchStripeRealtimeToken } from "@/lib/nodes/executions/stripe-trigger/get-subscribe-token";

export const StripeTriggerNode = memo((props: NodeProps) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const nodeStatus = useNodeStatus({
        channel: STRIPE_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchStripeRealtimeToken,
    });

    return (
        <>
            <StripeTriggerDialog open={showDialog} setShowDialog={setShowDialog} />
            <BaseTriggerNode
                {...props}
                id={props.id}
                icon={"/icons/stripe.svg"}
                name="Stripe"
                description="when stripe event is captured"
                status={nodeStatus.status}
                errorMessage={nodeStatus.errorMessage}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});
