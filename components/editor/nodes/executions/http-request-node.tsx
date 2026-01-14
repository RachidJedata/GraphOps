"use client";

import { GlobeIcon } from "lucide-react";
import { BaseExecutionNode } from "../base-nodes/base-execution-node";
import { Node, NodeProps } from "@xyflow/react";
import { memo } from "react";

type HttpRequestNodeData = {
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: string;
    [key: string]: unknown;
};

type HttpRequestNodeProps = Node<HttpRequestNodeData>;
export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeProps>) => {
    const nodeData = props.data;

    const description = nodeData?.endpoint
        ? `(${nodeData.method || 'GET'}): ${nodeData.endpoint}`
        : 'Not configured';
    return (
        <BaseExecutionNode
            {...props}
            description={description}
            name="HTTP Request"
            icon={GlobeIcon}
            onDoubleClick={() => { }}
            onSettingsClick={() => { }}

        />
    );
});

HttpRequestNode.displayName = "HttpRequestNode";
