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
import { appsScriptSnippet } from "@/lib/nodes/executions/google-form/google-form-trigger-script";

export default function GogleFormTriggerDialog({
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

    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workFlowId=${workFlowId}`;

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
                    <DialogTitle>Google Form Configuration</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Use this webhook URL in your Google Form's Apps Script to trigger this workflow when a form is submitted.
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
                                {copiedUrl ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
                            </Button>
                        </div>
                    </div>

                    {/* Google Apps Script */}
                    <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                        <h4 className="text-sm font-medium">Google Apps script: </h4>
                        <Button
                            onClick={() => copyToClipBoard(appsScriptSnippet(webhookUrl), setCopiedScript)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 max"
                        >
                            {copiedScript ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
                            Google Apps Script
                        </Button>
                        <p className="text-muted-foreground text-sm">this script contains your webhook URL and handles form submission </p>
                    </div>

                    {/* Instructions */}
                    <div className="text-sm text-muted-foreground space-y-1">
                        <p>1. Open your Google Form.</p>
                        <p>2. Go to Extensions → Apps Script.</p>
                        <p>3. Paste the copied script and save.</p>
                        <p>4. Submit the form to trigger your workflow automatically.</p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button onClick={() => setShowDialog(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
