"use client";

import { BaseTriggerNode } from "../../base-nodes/base-trigger-node";
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import GogleFormTriggerDialog from "./dialog";
import { GOOGLE_FORM_CHANNEL_NAME } from "@/inngest/channels/google-form";
import { fetchGoogleFormDataRealtimeToken } from "@/lib/nodes/executions/google-form/get-subscribe-token";

export const GoogleFormTriggerNode = memo((props: NodeProps) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const nodeStatus = useNodeStatus({
        channel: GOOGLE_FORM_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchGoogleFormDataRealtimeToken,
    });

    return (
        <>
            <GogleFormTriggerDialog open={showDialog} setShowDialog={setShowDialog} />
            <BaseTriggerNode
                {...props}
                id={props.id}
                icon={"/icons/googleform.svg"}
                name="Google Form"
                description="when form is submitted"
                status={nodeStatus}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});
