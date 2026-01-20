"use client";

import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../../base-nodes/base-trigger-node";
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import ManualTriggerNodeDialog from "./dialog";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import { MANUAL_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/manual-trigger";
import { fetchManualTriggerRealtimeToken } from "@/lib/nodes/executions/manual-trigger/get-subscribe-token";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const nodeStatus = useNodeStatus({
        channel: MANUAL_TRIGGER_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchManualTriggerRealtimeToken,
    });

    return (
        <>
            <ManualTriggerNodeDialog open={showDialog} setShowDialog={setShowDialog} />
            <BaseTriggerNode
                {...props}
                id={props.id}
                icon={MousePointerIcon}
                name="Manual Trigger"
                status={nodeStatus.status}
                errorMessage={nodeStatus.errorMessage}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});
