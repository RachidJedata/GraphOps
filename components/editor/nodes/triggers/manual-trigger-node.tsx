"use client";

import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-nodes/base-trigger-node";
import { memo } from "react";
import { NodeProps } from "@xyflow/react";

export const ManualTriggerNode = memo((props: NodeProps) => {
    return (
        <BaseTriggerNode
            {...props}
            icon={MousePointerIcon}
            name="Manual Trigger"
            //status={nodeStatus}
            // onDoubleClick={}
            // onSettingsClick={}
            
        />
    );
});
