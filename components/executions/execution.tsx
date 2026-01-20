"use client"

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2Icon, CheckCircle2Icon, XCircleIcon, ZapIcon, HashIcon, ClockIcon, CalendarIcon } from 'lucide-react';
import { ExecutionStatus } from '@/lib/generated/prisma/enums';
import { useSuspenseGetOneExecution } from '@/hooks/executions/use-executions';
import { JsonValue } from '@prisma/client/runtime/client';
import Link from 'next/link';


function StatusBadge({ status }: { status: ExecutionStatus }) {
    const variants = {
        RUNNING: { icon: Loader2Icon, className: 'bg-blue-500/10 text-blue-700 border-blue-200', label: 'Running' },
        SUCCESS: { icon: CheckCircle2Icon, className: 'bg-green-500/10 text-green-700 border-green-200', label: 'Success' },
        FAILED: { icon: XCircleIcon, className: 'bg-red-500/10 text-red-700 border-red-200', label: 'Failed' }
    };

    const { icon: Icon, className, label } = variants[status];

    return (
        <Badge variant="outline" className={`${className} flex items-center gap-1.5 w-fit`}>
            <Icon className={`h-3.5 w-3.5 ${status === 'RUNNING' ? 'animate-spin' : ''}`} />
            {label}
        </Badge>
    );
}

function formatDuration(start: Date, end: Date): string {

    const ms = end.getTime() - start.getTime();
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

function JsonViewer({ data }: { data: JsonValue }) {
    return (
        <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto text-sm">
            <code className="text-slate-800">{JSON.stringify(data, null, 2)}</code>
        </pre>
    );
}

export function ExecutionView({ executionId }: { executionId: string }) {
    const { data: execution } = useSuspenseGetOneExecution(executionId);

    if (!execution) throw new Error("Execution not found");

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Execution Details</h1>
                    <StatusBadge status={execution.status} />
                </div>
                <p className="text-muted-foreground">
                    View detailed information about this workflow execution
                </p>
            </div>

            {/* Error Alert */}
            {execution.error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <XCircleIcon className="h-4 w-4" />
                    <AlertDescription>
                        <div className="font-medium mb-1">Execution Failed</div>
                        <div className="text-sm">{execution.error}</div>
                    </AlertDescription>
                </Alert>
            )}

            {/* Overview Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ZapIcon className="h-5 w-5" />
                        Overview
                    </CardTitle>
                    <CardDescription>General execution information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <HashIcon className="h-4 w-4" />
                                Workflow
                            </div>
                            <div className="font-mono text-sm bg-slate-50 px-3 py-2 rounded border">
                                <Link
                                    prefetch
                                    href={`/workflows/${execution.workflowId}`}
                                >
                                    {execution.workflow.name}
                                </Link>
                            </div>
                        </div>

                        {execution.completedAt && (

                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ClockIcon className="h-4 w-4" />
                                    Duration
                                </div>
                                <div className="font-mono text-sm bg-slate-50 px-3 py-2 rounded border">
                                    {formatDuration(execution.startedAt, execution.completedAt)}
                                </div>
                            </div>
                        )}

                    </div>
                </CardContent>
            </Card>

            {/* Timing Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5" />
                        Timing
                    </CardTitle>
                    <CardDescription>Execution timeline details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Started At</div>
                        <div className="text-sm font-medium">
                            {execution.startedAt.toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'medium'
                            })}
                        </div>
                    </div>

                    {(execution.completedAt || execution.status === "RUNNING") && (
                        <>
                            <Separator />

                            <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Completed At</div>
                                <div className="text-sm font-medium">
                                    {execution.completedAt
                                        ? execution.completedAt.toLocaleString('en-US', {
                                            dateStyle: 'medium',
                                            timeStyle: 'medium'
                                        })
                                        : 'In progress...'}
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Output Card */}
            {execution.output && (

                <Card>
                    <CardHeader>
                        <CardTitle>Output</CardTitle>
                        <CardDescription>Execution result data</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <JsonViewer data={execution.output} />
                    </CardContent>
                </Card>
            )}


            {/* Error Stack Card */}
            {execution.errorStack && (
                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-red-700">Error Stack Trace</CardTitle>
                        <CardDescription>Detailed error information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-red-50 border border-red-200 rounded-lg p-4 overflow-x-auto text-sm">
                            <code className="text-red-900">{execution.errorStack}</code>
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}