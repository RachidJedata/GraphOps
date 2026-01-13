import { Editor } from "@/components/editor/editor";
import { EditorHeader } from "@/components/editor/editor-header";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { prefetchWorkFlow } from "@/lib/workflows/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from 'react-error-boundary'

export default async function WorkFlow({ params }: { params: Promise<{ workFlowId: string }> }) {
    const { workFlowId } = await params;
    prefetchWorkFlow(workFlowId);

    return (
        <>
            <HydrateClient>
                <ErrorBoundary fallback={<ErrorView entity="editor" message="WorkFlow isn't found please try again!" />}>
                    <Suspense fallback={<LoadingView entity="editor" />}>
                        <EditorHeader workFlowId={workFlowId} />
                        <main className="flex-1">
                            <Editor workFlowId={workFlowId} />
                        </main>
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </>
    );
}