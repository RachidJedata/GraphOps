"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import BaseNodeDialogContext from "../base-dialog";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    variableName: z.string().min(1, "Variable name is required"),
    username: z.string().optional(),
    webhookUrl: z.string().min(1, "Webhook URL is required"),
    content: z.string()
        .min(1, "message content is required")
        .max(2000, "discord maximum message limit"),
});

export type DiscordFormValues = z.infer<typeof formSchema>;

interface DiscordNodeDialogProps {
    setShowDialog: (show: boolean) => void;
    open: boolean;
    nodeData: DiscordFormValues;
    onSubmit: (values: DiscordFormValues) => void;
    inputData?: any;
    outputData?: any;

}

export default function DiscordNodeDialog({
    setShowDialog,
    open,
    nodeData,
    onSubmit,
    inputData,
    outputData,
}: DiscordNodeDialogProps) {
    const form = useForm<DiscordFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: nodeData,
    });

    useEffect(() => {
        form.reset(nodeData);
    }, [nodeData, form]);

    const handleSubmit = (values: DiscordFormValues) => {
        onSubmit(values);
        setShowDialog(false);
    };

    return (
        <BaseNodeDialogContext
            title="Discord Configuration"
            description="Configure the Discord webhook settings for this node"
            open={open}
            setShowDialog={setShowDialog}
            inputData={inputData}
            outputData={outputData}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="py-2 space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="variableName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Variable Name</FormLabel>
                                <FormControl>
                                    <Input
                                        // value={field.value}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    use this name to reference the result in other nodes: {" "}
                                    {`{{${(field.value || "Discord")}.context}}`}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="webhookUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Webhook URL</FormLabel>
                                <FormControl>
                                    <Input
                                        autoFocus
                                        placeholder="https://discord.com/api/webhooks/..."
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Get this from Discord: Channel settings -{">"} Integrations -{">"} Webhooks
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bot username (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Workflow Bot"
                                        // value={field.value}
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Override the webhook's default username
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Summary: {{aiResponse}}"
                                        className="min-h-20 font-mono text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    You can send a dynamic message or static one.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter className="gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </Form>
        </BaseNodeDialogContext>
    );
}
