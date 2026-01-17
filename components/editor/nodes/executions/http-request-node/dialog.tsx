"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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

const formSchema = z.object({
    variableName: z.string()
        .min(1, "Variable name is required")
        .regex(/^[a-zA-Z_$][a-zA-Z0-9_$]*$/, "Invalid variable name"),
    endpoint: z.string().min(1, "Please enter a URL"),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface HttpRequestNodeDialogProps {
    setShowDialog: (show: boolean) => void;
    open: boolean;
    nodeData: HttpRequestFormValues;
    onSubmit: (values: HttpRequestFormValues) => void;
}

export default function HttpRequestNodeDialog({
    setShowDialog,
    open,
    nodeData,
    onSubmit,
}: HttpRequestNodeDialogProps) {

    const form = useForm<HttpRequestFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...nodeData,
            method: nodeData.method || "GET",
        },
    });

    const formWatch = form.watch("method");


    useEffect(() => {
        form.reset({
            ...nodeData,
            method: nodeData.method || "GET"
        });
    }, [nodeData, form]);

    const handleSubmit = (values: HttpRequestFormValues) => {
        onSubmit(values);
        setShowDialog(false);
    };

    return (
        <Dialog open={open} onOpenChange={setShowDialog}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Configure the HTTP Request node settings below.
                    </DialogDescription>
                </DialogHeader>

                <Separator />

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
                                        {`{{${(field.value || "httpResponse")}.data}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                                            // value={field.value}
                                            autoFocus
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs">
                                        Static url or use {"{{variable}}"} syntax to reference data from previous nodes.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem >
                                    <FormLabel>HTTP Method</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl className="w-full">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select HTTP method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">
                                                DELETE
                                            </SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-xs">
                                        Choose the HTTP method for your request.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Body */}
                        {formWatch !== "GET" && formWatch !== "DELETE" && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Body (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={'{\n "items": "{{httpResponse.data.items}}," \n "name": "{{httpResponse.data.name}}" \n}'}
                                                className="min-h-25 font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            JSON body for POST, PUT, or PATCH requests. Use {"{{variable}}"} syntax to reference data from previous nodes. or {"json {{httpResponse.data}}"}  to stringify JSON data.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

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
            </DialogContent>
        </Dialog>
    );
}
