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
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { CopyIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

export default function StripeTriggerDialog({
    setShowDialog,
    open,
}: {
    setShowDialog: (show: boolean) => void;
    open: boolean;
}) {
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedScript, setCopiedScript] = useState(false);

    const params = useParams();
    const workFlowId = params.workFlowId as string;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const webhookUrl = `${baseUrl}/api/webhooks/stripe?workFlowId=${workFlowId}`;

    const copyToClipBoard = async (text: string, setCopied: (val: boolean) => void) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error("Failed to copy");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Configure this webhook URL in your Stripe dashboard to trigger this workflow on payment events.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                {/* Webhook URL */}
                <div className="py-2 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Webhook URL</label>
                        <div className="flex gap-2">
                            <Input readOnly value={webhookUrl} className="flex-1" />
                            <Button
                                onClick={() => copyToClipBoard(webhookUrl, setCopiedUrl)}
                                type="button"
                                variant="outline"
                                size="icon"
                            >
                                {copiedUrl ? <CheckIcon className="text-primary" /> : <CopyIcon />}
                            </Button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-muted rounded-lg p-4 space-y-2 ">
                        <h4 className="font-medium text-sm">Setup Instructions</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Log in to your Stripe Dashboard and go to Developers .{">"} Webhooks.</li>
                            <li>Click Add endpoint (or + Add destination) to create a new webhook endpoint.</li>
                            <li>In the Endpoint URL field, paste your public webhook receiver URL.</li>
                            <li>Select the events you want Stripe to send (e.g., checkout.session.completed, payment_intent.succeeded), then click Add endpoint.</li>
                        </ol>
                    </div>

                </div>

                <DialogFooter className="gap-2">
                    <Button onClick={() => setShowDialog(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
