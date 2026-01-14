"use client"

import { memo, useState } from "react";
import { PlaceholderNode } from "@/components/react-flow/placeholder-node";
import { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { WorkFlowNode } from "../../workflow-node";
import { NodeSelector } from "../../node-selector";

const InitialNode = memo((props: NodeProps) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <NodeSelector open={open} setOpen={setOpen} >
                <WorkFlowNode
                    showToolBar={false}
                >
                    <PlaceholderNode
                        onClick={() => setOpen(true)}
                        {...props}
                    >
                        <div className="cursor-pointer flex items-center flex-row justify-center">
                            <PlusIcon className="size-4" />
                        </div>
                    </PlaceholderNode>
                </WorkFlowNode >
            </NodeSelector>
        </>
    );
});

InitialNode.displayName = "InitialNode";

export default InitialNode;