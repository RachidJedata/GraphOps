import WorkFlowsList, { WorkflowsContainer } from "@/components/workflows/workflows";
import { prefetchWorkFlows } from "@/lib/workflows/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function WorkFlow() {
    prefetchWorkFlows();
    return (
        <WorkflowsContainer>
            WorkFlow Page
            <HydrateClient>
                <ErrorBoundary fallback={<p>Error!</p>}>
                    <Suspense fallback={"loading"}>
                        <WorkFlowsList />
                    </Suspense>
                </ErrorBoundary>

            </HydrateClient>
        </WorkflowsContainer>
    );
}