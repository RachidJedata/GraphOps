import WorkFlowsList, { WorkflowsContainer } from "@/components/workflows/workflows";
import { workFlowsParamsLoader } from "@/lib/workflows/params";
import { prefetchWorkFlows } from "@/lib/workflows/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { SearchParams } from 'nuqs/server'

type PageProps = {
    searchParams: Promise<SearchParams>
}

export default async function WorkFlow({ searchParams }: PageProps) {
    const params = await workFlowsParamsLoader(searchParams);
    prefetchWorkFlows(params);

    return (
        <WorkflowsContainer>
            WorkFlow Page
            <HydrateClient>
                <ErrorBoundary fallback={<p>Error!</p>}>
                    <Suspense fallback={" loading ..."}>
                        <WorkFlowsList />
                    </Suspense>
                </ErrorBoundary>

            </HydrateClient>
        </WorkflowsContainer>
    );
}