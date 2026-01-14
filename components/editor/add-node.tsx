"use client";

import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

export const AddNodeButton = memo(function AddNodeButton() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative inline-flex items-center">
            <Button
                size="sm"
                variant="secondary"
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    "h-8 px-3 text-xs font-medium bg-primary/15 hover:bg-accent hover:text-accent-foreground",
                    "transition-colors"
                )}
            >
                <PlusIcon />
            </Button>

            {open && (
                <div
                    className={cn(
                        "absolute top-full mt-2 w-40 rounded-md border bg-background p-2 shadow-md",
                        "animate-in fade-in zoom-in-95"
                    )}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                            setOpen(false);
                            // TODO: create node type A
                        }}
                    >
                        Basic Node
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => {
                            setOpen(false);
                            // TODO: create node type B
                        }}
                    >
                        Conditional Node
                    </Button>
                </div>
            )}
        </div>
    );
});

AddNodeButton.displayName = "AddNodeButton";
