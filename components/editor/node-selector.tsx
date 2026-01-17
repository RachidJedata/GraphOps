"use client";

import { NodeType } from '@/lib/generated/prisma/enums';
import { createId } from '@paralleldrive/cuid2'
import { GlobeIcon, MousePointerIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useReactFlow } from '@xyflow/react';
import { toast } from 'sonner';
import { useCallback } from 'react';

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    icon: React.ComponentType<{ className?: string }> | string;
    description: string;
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: 'Manual Trigger',
        icon: MousePointerIcon,
        description: 'Manual trigger to start a workflow, usually from a user action. Easy to begin your automation journey.',
    },
    {
        type: NodeType.GOOGLE_FORM_TRIGGER,
        label: 'Google form',
        icon: "/icons/googleform.svg",
        description: 'Runs the flow when the google form is submitted',
    },
];
const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: 'HTTP Request',
        icon: GlobeIcon,
        description: 'Make HTTP requests to external APIs. Integrate with web services and fetch data seamlessly.',
    },
];


function NodeOptionCard({ option, handleSelectNode }: { option: NodeTypeOption, handleSelectNode: () => void }) {
    return (
        <div
            className=" h-auto w-full justify-start
                        p-2 rounded-none cursor-pointer 
                        border-l-2 border-transparent
                        hover:border-l-primary
                        hover:bg-accent/50
                        transition-colors"
            onClick={handleSelectNode}
        >
            <div className="flex w-full gap-3 justify-items-center">
                {typeof option.icon !== 'string' ? (
                    <div className="mt-1">
                        <option.icon className="size-5 shrink-0 text-muted-foreground" />
                    </div>
                ) : (
                    <Image
                        src={option.icon}
                        alt={option.label}
                        className="size-6 object-contain shrink-0 text-muted-foreground"
                        width={20}
                        height={20}
                    />
                )}
                <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{option.label}</span>
                        <Badge variant="secondary" className="text-xs">
                            {option.type}
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
                        {option.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export function NodeSelector({ open, setOpen, children }: { children: React.ReactNode, open: boolean, setOpen: (open: boolean) => void }) {
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleSelectNode = useCallback((option: NodeTypeOption) => {

        if (option.type === NodeType.MANUAL_TRIGGER) {
            // Check if an Initial node already exists
            const existingInitialNode = getNodes().find(node => node.type === NodeType.MANUAL_TRIGGER);
            if (existingInitialNode) {
                toast.error("An Initial node already exists in the workflow.");
                return;
            }
        }

        setNodes((nds) => {

            const hasInitialNode = nds.some(node => node.type === NodeType.INITIAL);

            const flowPosition = screenToFlowPosition({
                x: (window.innerWidth / 2) + (Math.random() - .5) * 200,
                y: (window.innerHeight / 2) + (Math.random() - .5) * 200,
            });

            const newNode = {
                id: createId(),
                type: option.type,
                position: flowPosition,
                data: {},
            }

            if (hasInitialNode) return [newNode];

            return [...nds, newNode,];
        });
        setOpen(false);
    }, [setNodes, getNodes, screenToFlowPosition, setOpen]);

    return (
        <div className="relative inline-flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    {children}
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-125">
                    <SheetHeader>
                        <SheetTitle>Add Node</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-150 w-full rounded-md border">
                        <div className="p-4  space-y-6">
                            {/* Trigger Nodes Section */}
                            <div className="space-y-3 mb-2">
                                <div>
                                    <h3 className="text-sm font-semibold mb-1">Triggers</h3>
                                    <p className="text-xs text-muted-foreground">Start your workflow</p>
                                </div>
                                <div className="space-y-2">
                                    {triggerNodes.map((node) => (
                                        <NodeOptionCard handleSelectNode={() => handleSelectNode(node)} key={node.type} option={node} />
                                    ))}
                                </div>
                            </div>

                            <Separator className='mb-1' />

                            {/* Execution Nodes Section */}
                            <div className="space-y-2 ">
                                <div>
                                    <h3 className="text-sm font-semibold mb-1">Actions</h3>
                                    <p className="text-xs text-muted-foreground">Execute operations</p>
                                </div>
                                <div className="space-y-2">
                                    {executionNodes.map((node) => (
                                        <NodeOptionCard handleSelectNode={() => handleSelectNode(node)} key={node.type} option={node} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>

    );
}