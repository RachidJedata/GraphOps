"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { NodeSelector } from "./node-selector";


export const AddNodeButton = memo(function AddNodeButton() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <NodeSelector open={open} setOpen={setOpen} >
                <Button
                    size="sm"
                    variant="secondary"
                    className={cn(
                        "h-8 px-3 text-xs font-medium bg-primary/15 hover:bg-accent hover:text-accent-foreground",
                        "transition-colors"
                    )}
                    onClick={() => setOpen(true)}
                >
                    <PlusIcon className="size-4" />
                </Button>
            </NodeSelector>
        </>
    );
});

AddNodeButton.displayName = "AddNodeButton";
