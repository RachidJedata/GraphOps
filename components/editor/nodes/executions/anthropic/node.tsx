"use client";

import { BaseExecutionNode } from "../../base-nodes/base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { NodeType } from "@/lib/generated/prisma/enums";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import { useNodeContext } from "@/hooks/nodes/use-node-context";
import AnthropicNodeDialog, { AnthropicFormValues } from "./dialog";
import { ANTHROPIC_CONTEXT_CHANNEL_NAME, ANTHROPIC_STATUS_CHANNEL_NAME } from "@/inngest/channels/anthropic";
import { fetchAnthropicContextRealtimeToken, fetchAnthropicStatusRealtimeToken } from "@/lib/nodes/triggers/anthropic/get-subscribe-token";

type AnthropicNodeProps = Node<AnthropicFormValues>;

export const anthropicNode = memo((props: NodeProps<AnthropicNodeProps>) => {
    const [showDialog, setShowDialog] = useState(false);
    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const { setNodes, getNodes } = useReactFlow();
    const handleSubmit = (values: AnthropicFormValues) => {
        setNodes((nds) => {
            return nds.map((node) => {
                if (node.id === props.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...values,
                        },
                    };
                }
                return node;
            });
        });
    }
    const nodeData = props.data;

    const description = nodeData?.userPrompt && nodeData.modelId
        ? nodeData.modelId : 'Not configured';

    useEffect(() => {
        if (nodeData.variableName) return;

        const nodeCount = getNodes().filter(node => node.type === NodeType.ANTHROPIC).length

        setNodes((nds) =>
            nds.map((node) =>
                node.id === props.id
                    ? { ...node, data: { ...node.data, variableName: `anthropic${nodeCount}` } }
                    : node
            )
        );

    }, [props.id, nodeData.variableName, getNodes, setNodes]);

    const nodeStatus = useNodeStatus({
        channel: ANTHROPIC_STATUS_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchAnthropicStatusRealtimeToken,
    });
    const inputData = useNodeContext({
        channel: ANTHROPIC_CONTEXT_CHANNEL_NAME,
        dataType: "inputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchAnthropicContextRealtimeToken,
    });
    const outputData = useNodeContext({
        channel: ANTHROPIC_CONTEXT_CHANNEL_NAME,
        dataType: "outputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchAnthropicContextRealtimeToken,
    });

    return (
        <>
            <AnthropicNodeDialog
                inputData={inputData}
                outputData={outputData}
                open={showDialog}
                setShowDialog={setShowDialog}
                nodeData={nodeData}
                onSubmit={handleSubmit}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                description={description}
                name="Anthropic"
                icon={"/icons/anthropic.svg"}
                status={nodeStatus.status}
                errorMessage={nodeStatus.errorMessage}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});

anthropicNode.displayName = "AnthropicNode";
