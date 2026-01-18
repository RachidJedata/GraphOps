"use client";

import { BaseExecutionNode } from "../../base-nodes/base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { NodeType } from "@/lib/generated/prisma/enums";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import { useNodeContext } from "@/hooks/nodes/use-node-context";
import GeminiNodeDialog, { GeminiFormValues } from "./dialog";
import { GEMINI_CONTEXT_CHANNEL_NAME, GEMINI_STATUS_CHANNEL_NAME } from "@/inngest/channels/gemini";
import { fetchGeminiContextRealtimeToken, fetchGeminiStatusRealtimeToken } from "@/lib/nodes/triggers/gemini/get-subscribe-token";

type GeminiNodeProps = Node<GeminiFormValues>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeProps>) => {
    const [showDialog, setShowDialog] = useState(false);
    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const { setNodes, getNodes } = useReactFlow();
    const handleSubmit = (values: GeminiFormValues) => {
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

        const nodeCount = getNodes().filter(node => node.type === NodeType.GEMINI).length

        setNodes((nds) =>
            nds.map((node) =>
                node.id === props.id
                    ? { ...node, data: { ...node.data, variableName: `gemini${nodeCount}` } }
                    : node
            )
        );

    }, [props.id, nodeData.variableName, getNodes, setNodes]);

    const nodeStatus = useNodeStatus({
        channel: GEMINI_STATUS_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchGeminiStatusRealtimeToken,
    });
    const inputData = useNodeContext({
        channel: GEMINI_CONTEXT_CHANNEL_NAME,
        dataType: "inputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchGeminiContextRealtimeToken,
    });
    const outputData = useNodeContext({
        channel: GEMINI_CONTEXT_CHANNEL_NAME,
        dataType: "outputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchGeminiContextRealtimeToken,
    });

    return (
        <>
            <GeminiNodeDialog
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
                name="Gemini"
                icon={"/icons/gemini.svg"}
                status={nodeStatus}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});

GeminiNode.displayName = "GeminiNode";
