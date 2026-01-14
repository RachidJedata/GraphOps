"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";

interface WorkFlowNodeProps {
    children: React.ReactNode;
    showToolBar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string;
}

export function WorkFlowNode({
    children,
    showToolBar = true,
    onDelete,
    onSettings,
    name,
    description,
}: WorkFlowNodeProps) {
    return (
        <>
            {showToolBar && (
                <NodeToolbar>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onSettings}
                        className="size-4"
                    >
                        <SettingsIcon />
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={onDelete}
                        className="size-4"
                    >
                        <TrashIcon />
                    </Button>

                </NodeToolbar>
            )}

            {children}

            {/* Header */}
            {name && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-50 text-center"
                >
                    <p className="font-medium">
                        {name}
                    </p>
                    {description && (
                        <p className="truncate text-sm text-muted-foreground">
                            {description}
                        </p>
                    )}
                </NodeToolbar>
            )}
        </>
    );
}
