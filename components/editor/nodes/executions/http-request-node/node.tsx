"use client";

import { GlobeIcon } from "lucide-react";
import { BaseExecutionNode } from "../../base-nodes/base-execution-node";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { memo, useState } from "react";
import HttpRequestNodeDialog from "./dialog";

interface HttpRequestData {
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: string;
}

interface HttpRequestNodeData extends HttpRequestData {
    [key: string]: unknown;
};

type HttpRequestNodeProps = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeProps>) => {
    const [showDialog, setShowDialog] = useState(false);
    const handleDoubleClick = () => {
        setShowDialog(true);
    }

    const { setNodes } = useReactFlow();
    const handleSubmit = (values: HttpRequestData) => {
        console.log("HTTP Request Node values:", values);
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
        ? `${nodeData.method || 'GET'}: ${nodeData.endpoint}`
        : 'Not configured';
    return (
        <>
            <HttpRequestNodeDialog
                open={showDialog}
                setShowDialog={setShowDialog}
                defaultEndpoint={nodeData?.endpoint}
                defaultMethod={nodeData?.method || "GET"}
                defaultBody={nodeData?.body}
                onSubmit={handleSubmit}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                description={description}
                name="HTTP Request"
                icon={GlobeIcon}
                status={"initial"}
                onDoubleClick={handleDoubleClick}
                onSettingsClick={handleDoubleClick}
            />
        </>
    );
});

HttpRequestNode.displayName = "HttpRequestNode";
