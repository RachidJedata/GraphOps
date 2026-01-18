"use client";

import { BaseExecutionNode } from "../../base-nodes/base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { NodeType } from "@/lib/generated/prisma/enums";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import { useNodeContext } from "@/hooks/nodes/use-node-context";
import { OpenAIFormValues } from "./dialog";
import { fetchGeminiContextRealtimeToken } from "@/lib/nodes/triggers/gemini/get-subscribe-token";
import OpenAINodeDialog from "./dialog";
import { OPENAI_CONTEXT_CHANNEL_NAME, OPENAI_STATUS_CHANNEL_NAME } from "@/inngest/channels/openai";
import { fetchOpenAIStatusRealtimeToken } from "@/lib/nodes/triggers/openai/get-subscribe-token";

type OpenAINodeProps = Node<OpenAIFormValues>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeProps>) => {
    const [showDialog, setShowDialog] = useState(false);
    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const { setNodes, getNodes } = useReactFlow();
    const handleSubmit = (values: OpenAIFormValues) => {
        // console.log("HTTP Request Node values:", values);
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

        const lastNode = getNodes().filter(node => node.type === NodeType.GEMINI).length

        nodeData.variableName = `openai${lastNode}`;

    }, [props.id]);

    const nodeStatus = useNodeStatus({
        channel: OPENAI_STATUS_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchOpenAIStatusRealtimeToken,
    });
    const inputData = useNodeContext({
        channel: OPENAI_CONTEXT_CHANNEL_NAME,
        dataType: "inputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchGeminiContextRealtimeToken,
    });
    const outputData = useNodeContext({
        channel: OPENAI_CONTEXT_CHANNEL_NAME,
        dataType: "outputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchGeminiContextRealtimeToken,
    });

    return (
        <>
            <OpenAINodeDialog
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
                name="OpenAI"
                icon={"/icons/openai.svg"}
                status={nodeStatus}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});

OpenAINode.displayName = "OpenAINode";
