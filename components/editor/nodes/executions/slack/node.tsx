"use client";

import { BaseExecutionNode } from "../../base-nodes/base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import { NodeType } from "@/lib/generated/prisma/enums";
import { useNodeContext } from "@/hooks/nodes/use-node-context";
import { fetchSlackContextRealtimeToken, fetchSlackStatusRealtimeToken } from "@/lib/nodes/triggers/slack/get-subscribe-token";
import SlackNodeDialog, { SlackFormValues } from "./dialog";
import { SLACK_CONTEXT_CHANNEL_NAME, SLACK_STATUS_CHANNEL_NAME } from "@/inngest/channels/slack";

type SlackNodeProps = Node<SlackFormValues>;

export const SlackNode = memo((props: NodeProps<SlackNodeProps>) => {
    const [showDialog, setShowDialog] = useState(false);
    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const { setNodes, getNodes } = useReactFlow();
    const handleSubmit = (values: SlackFormValues) => {
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

    useEffect(() => {
        if (nodeData.variableName) return;

        const nodeCount = getNodes().filter(node => node.type === NodeType.SLACK).length

        setNodes((nds) =>
            nds.map((node) =>
                node.id === props.id
                    ? { ...node, data: { ...node.data, variableName: `slack${nodeCount}` } }
                    : node
            )
        );

    }, [props.id, nodeData.variableName, getNodes, setNodes]);

    const description = nodeData?.content
        ? `Send: ${nodeData.content.slice(0, 50)}...` : 'Not configured';


    const nodeStatus = useNodeStatus({
        channel: SLACK_STATUS_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchSlackStatusRealtimeToken,
    });

    const inputData = useNodeContext({
        channel: SLACK_CONTEXT_CHANNEL_NAME,
        dataType: "inputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchSlackContextRealtimeToken,
    });
    const outputData = useNodeContext({
        channel: SLACK_CONTEXT_CHANNEL_NAME,
        dataType: "outputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchSlackContextRealtimeToken,
    });


    return (
        <>
            <SlackNodeDialog
                open={showDialog}
                setShowDialog={setShowDialog}
                nodeData={nodeData}
                onSubmit={handleSubmit}
                inputData={inputData}
                outputData={outputData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                description={description}
                name="Slack"
                icon={"/icons/slack.svg"}
                status={nodeStatus}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});

SlackNode.displayName = "SlackNode";
