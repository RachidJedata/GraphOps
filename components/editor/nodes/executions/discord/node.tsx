"use client";

import { BaseExecutionNode } from "../../base-nodes/base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import { NodeType } from "@/lib/generated/prisma/enums";
import { useNodeContext } from "@/hooks/nodes/use-node-context";
import { DISCORD_CONTEXT_CHANNEL_NAME, DISCORD_STATUS_CHANNEL_NAME } from "@/inngest/channels/discord";
import { fetchDiscordContextRealtimeToken, fetchDiscordStatusRealtimeToken } from "@/lib/nodes/triggers/discord/get-subscribe-token";
import DiscordNodeDialog, { DiscordFormValues } from "./dialog";

type DiscordNodeProps = Node<DiscordFormValues>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeProps>) => {
    const [showDialog, setShowDialog] = useState(false);
    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const { setNodes, getNodes } = useReactFlow();
    const handleSubmit = (values: DiscordFormValues) => {
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

        const nodeCount = getNodes().filter(node => node.type === NodeType.DISCORD).length

        setNodes((nds) =>
            nds.map((node) =>
                node.id === props.id
                    ? { ...node, data: { ...node.data, variableName: `discord${nodeCount}` } }
                    : node
            )
        );

    }, [props.id, nodeData.variableName, getNodes, setNodes]);

    const description = nodeData?.content
        ? `Send: ${nodeData.content.slice(0, 50)}...` : 'Not configured';


    const nodeStatus = useNodeStatus({
        channel: DISCORD_STATUS_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchDiscordStatusRealtimeToken,
    });

    const inputData = useNodeContext({
        channel: DISCORD_CONTEXT_CHANNEL_NAME,
        dataType: "inputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchDiscordContextRealtimeToken,
    });
    const outputData = useNodeContext({
        channel: DISCORD_CONTEXT_CHANNEL_NAME,
        dataType: "outputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchDiscordContextRealtimeToken,
    });


    return (
        <>
            <DiscordNodeDialog
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
                name="Discord"
                icon={"/icons/discord.svg"}
                status={nodeStatus.status}
                errorMessage={nodeStatus.errorMessage}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});

DiscordNode.displayName = "DiscordNode";
