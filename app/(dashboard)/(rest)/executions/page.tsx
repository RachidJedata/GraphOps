import { ErrorView, LoadingView } from "@/components/entity-components";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { executionParamsLoader } from "@/lib/executions/params";
import { prefetchExecutions } from "@/lib/executions/prefetch";
import ExecutionsList, { ExecutionsContainer } from "@/components/executions/executions";

type PageProps = {
    searchParams: Promise<SearchParams>
}

export default async function Executions({ searchParams }: PageProps) {
    const params = await executionParamsLoader(searchParams);
    prefetchExecutions(params);

    return (
        <ExecutionsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<ErrorView entity="executions" />}>
                    <Suspense fallback={<LoadingView entity="executions" />}>
                        <ExecutionsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </ExecutionsContainer>
    );
}