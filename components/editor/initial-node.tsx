"use client"

import { memo } from "react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { WorkFlowNode } from "./workflow-node";

const InitialNode = memo((props: NodeProps) => {
    return (
        <WorkFlowNode
            showToolBar={false}
        >
            <PlaceholderNode
                onClick={() => { }}
                {...props}
            >
                <div className="cursor-pointer flex items-center flex-row justify-center">
                    <PlusIcon className="size-4" />
                </div>
            </PlaceholderNode>
        </WorkFlowNode >
    );
});

InitialNode.displayName = "InitialNode";

export default InitialNode;