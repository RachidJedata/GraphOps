"use client";

import { type ReactNode } from "react";
import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { BaseNode } from "@/components/react-flow/base-node";

export type PlaceholderNodeProps = Partial<NodeProps> & {
  children?: ReactNode;
  onClick?: () => void;
};

export function PlaceholderNode({ children, onClick }: PlaceholderNodeProps) {
  return (
    <BaseNode
      // className="bg-card w-37.5 border-dashed border-gray-400 p-2 text-center text-gray-400 shadow-none"
      className="bg-card w-auto h-auto hover:bg-primary/5  border-dashed border-primary p-4 text-center text-primary shadow-none cursor-pointer"
      onClick={onClick}
    >
      {children}
      <Handle
        type="target"
        style={{ visibility: "hidden" }}
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        type="source"
        style={{ visibility: "hidden" }}
        position={Position.Bottom}
        isConnectable={false}
      />
    </BaseNode>
  );
}
