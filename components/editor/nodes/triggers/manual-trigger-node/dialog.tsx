"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ManualTriggerNodeDialog({
    setShowDialog,
    open,
}: {
    setShowDialog: (show: boolean) => void;
    open: boolean;
}) {
    return (
        <Dialog open={open} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Configure how this workflow is manually triggered.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <div className="py-2 text-muted-foreground text-xs">
                    Used to manually trigger the workflow from the dashboard.

                </div>

                <DialogFooter className="gap-2">
                    <Button
                        onClick={() => {
                            // TODO: save configuration
                            setShowDialog(false);
                        }}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
