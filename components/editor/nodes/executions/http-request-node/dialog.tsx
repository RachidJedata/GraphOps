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
    endpoint: z.url("Please enter a valid URL"),
    method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
    body: z.string().optional(),
});

interface HttpRequestNodeDialogProps {
    setShowDialog: (show: boolean) => void;
    open: boolean;
    defaultEndpoint?: string;
    defaultMethod: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    defaultBody?: string;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export default function HttpRequestNodeDialog({
    setShowDialog,
    open,
    defaultEndpoint = "",
    defaultMethod = "GET",
    defaultBody = "",
    onSubmit,
}: HttpRequestNodeDialogProps) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
        },
    });

    const formWatch = form.watch("method");


    useEffect(() => {
        form.reset({
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
        });
    }, [defaultEndpoint, defaultMethod, defaultBody, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
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
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
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
                                        defaultValue={field.value}
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
