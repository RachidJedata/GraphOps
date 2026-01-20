

import { LucideIcon } from "lucide-react";
import { WorkFlowNode } from "../../workflow-node";
import { memo, useEffect } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import Image from "next/image";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { Position, useReactFlow } from "@xyflow/react";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";
import { toast } from "sonner";


interface BaseExecutionNodeProps {
    id: string;
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
    status?: NodeStatus;
    onSettingsClick?: () => void;
    onDoubleClick?: () => void;
    errorMessage?: string;

}

export const BaseExecutionNode = memo(({
    id,
    icon: Icon,
    name,
    description,
    onSettingsClick,
    onDoubleClick,
    children,
    status = 'initial',
    errorMessage,
}: BaseExecutionNodeProps) => {

    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
        setNodes((nds) => nds.filter((n) => n.id !== id));
        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    }

    useEffect(() => {
        if (!errorMessage) return;

        toast.error(errorMessage);
    }, [errorMessage]);


    return (
        <WorkFlowNode
            description={description}
            name={name}
            onSettings={onSettingsClick}
            onDelete={handleDelete}
        >
            <NodeStatusIndicator
                variant="border"
                className="rounded-md"
                status={status}
            >
                <BaseNode
                    status={status}
                    onDoubleClick={onDoubleClick}>
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
                            id="target-1"
                            type="target"
                            position={Position.Left}
                        />
                        <BaseHandle
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>
            </NodeStatusIndicator>
        </WorkFlowNode>
    );
});

BaseExecutionNode.displayName = 'BaseExecutionNode';