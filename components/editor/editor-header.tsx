"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { useSuspenseGetOneWorkFlow, useUpdateNameWorkFlow } from "@/hooks/workflows/use-workflows";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { CheckIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import type { WorkFlow } from "@/lib/generated/prisma/client";
import { Input } from "../ui/input";

export function EditorHeader({ workFlowId }: { workFlowId: string }) {
    const { data: workflow } = useSuspenseGetOneWorkFlow(workFlowId);

    if (!workflow) {
        throw new Error("Workflow doesn't exist");
    }

    return (
        <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
            {/* Sidebar toggle */}
            <SidebarTrigger />

            <Separator orientation="vertical" className="h-6" />

            {/* Breadcrumbs */}
            <EditBreadCrumbs
                workflowName={workflow.name}
                workFlowId={workflow.id}
            />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <EditSaveButton workflowId={workflow.id} />
        </header>
    );
}


function EditBreadCrumbs({ workflowName, workFlowId }: { workflowName: string; workFlowId: string; }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(workflowName);

    const updateWorkflowName = useUpdateNameWorkFlow();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editing]);

    const save = async () => {
        if (!value.trim()) {
            setValue(workflowName);
        } else {
            try {
                updateWorkflowName.mutateAsync({ id: workFlowId, name: value })
            } catch (error) {
                setValue(workflowName);
            }
        }
        setEditing(false);
    };

    const cancel = () => {
        setValue(workflowName);
        setEditing(false);
    };

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/workflows">Workflows</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />

                <BreadcrumbItem>
                    {editing ? (
                        <Input
                            ref={inputRef}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onBlur={save}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") save();
                                if (e.key === "Escape") cancel();
                            }}
                            className="h-7 w-55 text-sm"
                        />
                    ) : (
                        <span
                            onClick={() => setEditing(true)}
                            className="cursor-pointer truncate max-w-55 text-sm font-medium hover:text-foreground transition-colors"
                        >
                            {workflowName}
                        </span>
                    )}
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}

function EditSaveButton({ workflowId }: {
    workflowId: string;
}) {
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const updateNameMutation = useUpdateNameWorkFlow();

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaved(false);

            // TODO: save here 

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Button
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-24"
        >
            {isSaving ? (
                <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                </>
            ) : saved ? (
                <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Saved
                </>
            ) : (
                <>
                    <SaveIcon />
                    Save
                </>
            )}
        </Button>
    );
}