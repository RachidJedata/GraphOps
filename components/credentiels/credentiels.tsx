"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch } from "../entity-components";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { formatDistanceToNow } from 'date-fns';
import { useRemoveCredentiels, useSuspenseCredentiels, useSuspenseGetOneCredentiel } from "@/hooks/credentiels/use-credentiels";
import { useCredentielParams } from "@/hooks/credentiels/use-credentiels-params";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CredentialForm } from "./credential-form";
import { CredientielType } from "@/lib/generated/prisma/enums";

export default function CredentielsList() {
    const { data: credentiels } = useSuspenseCredentiels();

    return (
        <EntityList
            items={credentiels.items}
            getKey={(cr) => cr.id}
            emptyView={<EmptyCredentiels />}
            renderItem={(credentiel) => <CredentielItem credentiel={credentiel} />}
        />
    );
}

export const CredentielsHeader = ({ disabled }: { disabled: boolean }) => {
    return (
        <>
            <EntityHeader
                title="Credentiels"
                description="Create and manage your Credentiels"
                newButtonLabel="New Credentiels"
                newButtonHref="/credentials/new"
                disabled={disabled}
            />
        </>
    );
}


export const CredentielsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<CredentielsHeader disabled={false} />}
            search={<CredentielsSearch />}
            pagination={<CredentielsPagination />}
        >
            {children}
        </EntityContainer>
    );
}

export const CredentielsSearch = () => {
    const [params, setParams] = useCredentielParams();


    const { localSearch, setLocalSearch, debounceMs } = useEntitySearch({ params, setParams });

    return (
        <EntitySearch
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search Credentiels..."
        />
    );
}



export const CredentielsPagination = () => {
    const [params, setParams] = useCredentielParams();
    const Credentiels = useSuspenseCredentiels();


    const handlePageChange = (currentPage: number) => {
        setParams(prev => ({ ...prev, page: currentPage }))
    }
    return (
        <EntityPagination
            page={params.page}
            disabled={Credentiels.isFetching}
            onPageChange={handlePageChange}
            totalPages={Credentiels.data.totalPages}
        />
    );
}


export const EmptyCredentiels = () => {
    const router = useRouter();

    const handleCreate = () => router.push(`/credentials/new`)

    return <>
        <EmptyView
            entity="Credentiels"
            actionLabel="Create Credentiels"
            onAction={handleCreate}
            learnMoreHref="/docs/Credentiels"
        />
    </>

}

const CredentielItem = ({ credentiel }:
    {
        credentiel: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            userId: string;
            type: CredientielType;
        };
    }) => {

    const removeCredentiels = useRemoveCredentiels();

    return (
        <EntityItem
            key={credentiel.id}
            href={`/credentials/${credentiel.id}`}
            title={credentiel.name}
            subtitle={
                <>
                    {credentiel.createdAt.toString() !== credentiel.updatedAt.toString() &&
                        (
                            <>
                                Updated {" "}
                                {formatDistanceToNow(credentiel.updatedAt, { addSuffix: true })} {" "}
                                &bull; {" "}
                            </>
                        )
                    }
                    Created {" "}
                    {formatDistanceToNow(credentiel.createdAt, { addSuffix: true })} {" "}

                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <Image alt={credentiel.name} src={credentialIcon[credentiel.type]} className="size-5 text-muted-foreground rounded-sm" width={20} height={20} />
                </div>
            }
            onRemove={() => removeCredentiels.mutate({ id: credentiel.id })}
            isRemoving={removeCredentiels.isPending}
        />
    )
}

const credentialIcon: Record<CredientielType, string> = {
    [CredientielType.ANTHROPIC]: "/icons/anthropic.svg",
    [CredientielType.GEMINI]: "/icons/gemini.svg",
    [CredientielType.OPENAI]: "/icons/openai.svg",
}

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
    const { data } = useSuspenseGetOneCredentiel(credentialId);

    if (!data) throw new Error("Credential not found");


    return (
        <CredentialForm initialData={data} />);
} 