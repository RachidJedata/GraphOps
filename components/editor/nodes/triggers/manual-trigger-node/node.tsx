"use client";

import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../../base-nodes/base-trigger-node";
import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import ManualTriggerNodeDialog from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [showDialog, setShowDialog] = useState(false);

    const handleDoubleClick = () => {
        setShowDialog(true);
    }
    return (
        <>
            <ManualTriggerNodeDialog open={showDialog} setShowDialog={setShowDialog} />
            <BaseTriggerNode
                {...props}
                id={props.id}
                icon={MousePointerIcon}
                name="Manual Trigger"
                status={"initial"}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});
