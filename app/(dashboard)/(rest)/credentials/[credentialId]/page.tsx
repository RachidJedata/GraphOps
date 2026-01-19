import { CredentialView } from "@/components/credentiels/credentiels";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { prefetchCredentiel } from "@/lib/credientels/prefetch";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Credential({ params }: { params: Promise<{ credentialId: string }> }) {
    const { credentialId } = await params;
    prefetchCredentiel(credentialId);

    return (
        <>
            <HydrateClient>
                <ErrorBoundary fallback={<ErrorView entity="credential" message="Credential not found. Please try again." />}>
                    <Suspense fallback={<LoadingView entity="credential" />}>
                        <CredentialView credentialId={credentialId} />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </>
    );
}