import CredentielsList, { CredentielsContainer } from "@/components/credentiels/credentiels";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { credentielParamsLoader } from "@/lib/credientels/params";
import { prefetchCredentiels } from "@/lib/credientels/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

type PageProps = {
    searchParams: Promise<SearchParams>
}

export default async function WorkFlow({ searchParams }: PageProps) {
    const params = await credentielParamsLoader(searchParams);
    prefetchCredentiels(params);

    return (
        <CredentielsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<ErrorView entity="credentiels" />}>
                    <Suspense fallback={<LoadingView entity="credentiels" />}>
                        <CredentielsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </CredentielsContainer>
    );
}