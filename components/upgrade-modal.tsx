"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({
    open,
    onOpenChange,
}: UpgradeModalProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Upgrade required
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You need an active subscription to perform this action.
                        Upgrade to unlock more workflows and advanced features.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Cancel
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={() => authClient.checkout({ slug: "GraphOps-Pro" })}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Upgrade
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
