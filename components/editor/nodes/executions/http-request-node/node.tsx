"use client";

import { GlobeIcon } from "lucide-react";
import { BaseExecutionNode } from "../../base-nodes/base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";
import HttpRequestNodeDialog, { HttpRequestFormValues } from "./dialog";
import { NodeType } from "@/lib/generated/prisma/enums";
import { useNodeStatus } from "@/hooks/nodes/use-node-status";
import { HTTP_REQUEST_CONTEXT_CHANNEL_NAME, HTTP_REQUEST_STATUS_CHANNEL_NAME } from "@/inngest/channels/http-request";
import { fetchHttpRequestContextRealtimeToken, fetchHttpRequestStatusRealtimeToken } from "@/lib/nodes/triggers/http-request/get-subscribe-token";
import { useNodeContext } from "@/hooks/nodes/use-node-context";

type HttpRequestNodeProps = Node<HttpRequestFormValues>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeProps>) => {
    const [showDialog, setShowDialog] = useState(false);
    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const { setNodes, getNodes } = useReactFlow();
    const handleSubmit = (values: HttpRequestFormValues) => {
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

    const description = nodeData?.endpoint
        ? `{${nodeData.variableName ?? ""}}: ${nodeData.method}: ${nodeData.endpoint}`
        : 'Not configured';

    useEffect(() => {
        if (nodeData.variableName) return;

        const lastNode = getNodes().filter(node => node.type === NodeType.HTTP_REQUEST).length

        nodeData.variableName = `httpResponse${lastNode}`;

    }, [nodeData.endpoint]);

    const nodeStatus = useNodeStatus({
        channel: HTTP_REQUEST_STATUS_CHANNEL_NAME,
        nodeId: props.id,
        topic: "status",
        refreshToken: fetchHttpRequestStatusRealtimeToken,
    });
    const inputData = useNodeContext({
        channel: HTTP_REQUEST_CONTEXT_CHANNEL_NAME,
        dataType: "inputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchHttpRequestContextRealtimeToken,
    });
    const outputData = useNodeContext({
        channel: HTTP_REQUEST_CONTEXT_CHANNEL_NAME,
        dataType: "outputData",
        nodeId: props.id,
        topic: "context",
        refreshToken: fetchHttpRequestContextRealtimeToken,
    });

    return (
        <>
            <HttpRequestNodeDialog
                inputData={inputData}
                outputData={outputData}
                open={showDialog}
                setShowDialog={setShowDialog}
                nodeData={nodeData}
                // defaultMethod={nodeData?.method || "GET"}
                // defaultBody={nodeData?.body}
                onSubmit={handleSubmit}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                description={description}
                name="HTTP Request"
                icon={GlobeIcon}
                status={nodeStatus}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});

HttpRequestNode.displayName = "HttpRequestNode";
