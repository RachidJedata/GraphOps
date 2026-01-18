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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import BaseNodeDialogContext from "../base-dialog";
import { anthropicModelsId } from '@/types/triggers/anthropic/types'


const formSchema = z.object({
    variableName: z.string()
        .min(1, "Variable name is required")
        .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, "Invalid variable name"),
    modelId: z.enum(anthropicModelsId),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required"),
});

export type AnthropicFormValues = z.infer<typeof formSchema>;

interface HttpRequestNodeDialogProps {
    setShowDialog: (show: boolean) => void;
    open: boolean;
    nodeData: AnthropicFormValues;
    onSubmit: (values: AnthropicFormValues) => void;
    inputData?: any;
    outputData?: any;

}

export default function AnthropicNodeDialog({
    setShowDialog,
    open,
    nodeData,
    onSubmit,
    inputData,
    outputData,
}: HttpRequestNodeDialogProps) {

    const form = useForm<AnthropicFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...nodeData,
            modelId: nodeData.modelId || "claude-3-opus",
        },
    });

    useEffect(() => {
        form.reset({
            ...nodeData,
            modelId: nodeData.modelId || "claude-3-opus",
        });
    }, [nodeData, form]);

    const handleSubmit = (values: AnthropicFormValues) => {
        onSubmit(values);
        setShowDialog(false);
    };

    return (
        <BaseNodeDialogContext
            title="anthropic Configuration"
            description="Configure the AI model and prompts for this node"
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
                                    {`{{${(field.value || "anthropic")}.context}}`}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="modelId"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Model Name</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {anthropicModelsId.map(id => (
                                            <SelectItem key={id} value={id}>{id}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-xs">
                                    Choose the the model id of anthropic.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* System prompt */}
                    <FormField
                        control={form.control}
                        name="systemPrompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>System prompt (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="You are a helpful assistant"
                                        className="min-h-20 font-mono text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Sets the behavior of the assistant. Use {" {{variables}} "} for simple values or {" {{json variables}} "} to stringify objects
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="userPrompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>User prompt</FormLabel>
                                <FormControl>
                                    <Textarea
                                        autoFocus
                                        placeholder={`Summarize this text: {{json variable}}`}
                                        className="min-h-10 font-mono text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Static prompt or use {"{{variable}}"} syntax to reference data from previous nodes.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter className="gap-2 pt-4">
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
