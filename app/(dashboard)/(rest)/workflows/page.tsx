import WorkFlowsList, { EmptyWorkFlow, WorkflowsContainer } from "@/components/workflows/workflows";
import { workFlowsParamsLoader } from "@/lib/workflows/params";
import { prefetchWorkFlows } from "@/lib/workflows/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { SearchParams } from 'nuqs/server'
import { EmptyView, ErrorView, LoadingView } from "@/components/entity-components";

type PageProps = {
    searchParams: Promise<SearchParams>
}

export default async function WorkFlow({ searchParams }: PageProps) {
    const params = await workFlowsParamsLoader(searchParams);
    prefetchWorkFlows(params);

    return (
        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<ErrorView entity="workflows" />}>
                    <Suspense fallback={<LoadingView entity="workflows" />}>
                        <WorkFlowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    );
}