

import { LucideIcon } from "lucide-react";
import { WorkFlowNode } from "../../workflow-node";
import { memo } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { Position } from "@xyflow/react";


interface BaseTriggerNodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
    // status?: NodeStatus;
    onSettingsClick?: () => void;
    onDoubleClick?: () => void;

}

export const BaseTriggerNode = memo(({
    icon: Icon,
    name,
    description,
    onSettingsClick,
    onDoubleClick,
    children,
}: BaseTriggerNodeProps) => {

    const handleDelete = () => {

    }
    return (
        <WorkFlowNode
            description={description}
            name={name}
            onSettings={onSettingsClick}
            onDelete={handleDelete}
        >
            <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                <BaseNodeContent>
                    {typeof Icon !== 'string' ? (
                        <Icon className="size-4 shrink-0 text-primary" />
                    ) : (
                        <Image
                            src={Icon}
                            alt={name}
                            className="object-contain shrink-0 text-primary"
                            width={16}
                            height={16}
                        />

                    )}
                    {children}

                    <BaseHandle
                        id="source-1"
                        type="source"
                        position={Position.Right}
                    />
                </BaseNodeContent>
            </BaseNode>
        </WorkFlowNode>
    );
});

BaseTriggerNode.displayName = 'BaseTriggerNode';