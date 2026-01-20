import { ErrorView, LoadingView } from "@/components/entity-components";
import { ExecutionView } from "@/components/executions/execution";
import { prefetchExecution } from "@/lib/executions/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function ExecutionDetails({ params }: { params: Promise<{ executionId: string }> }) {
    const { executionId } = await params;
    prefetchExecution(executionId);

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<ErrorView entity="execution" message="Execution not found. Please try again." />}>
                <Suspense fallback={<LoadingView entity="execution" />}>
                    <ExecutionView executionId={executionId} />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>

    );
}