"use client"

import { useCreateWorkFlow, useSuspenseWorkFlows } from "@/hooks/workflows/use-workflows";
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "../entity-components";
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/lib/use-upgrade-modal";
import { useWorkFlowParams } from "@/hooks/workflows/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export default function WorkFlowsList() {
    const { data: workflows } = useSuspenseWorkFlows();
    return (
        <pre>
            {JSON.stringify(workflows, null, 2)}
        </pre>
    );
}

export const WorkflowsHeader = ({ disabled }: { disabled: boolean }) => {
    const createWorkFlow = useCreateWorkFlow();
    const router = useRouter();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkFlow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (err) => {
                console.log(err.message);
                // upgrade modal
                handleError(err);
            }
        })
    }
    return (
        <>
            {modal}
            <EntityHeader
                title="WorkFlows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New WorkFlow"
                disabled={disabled}
                isCreating={createWorkFlow.isPending}
            />
        </>
    );
}


export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader disabled={false} />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    );
}

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkFlowParams();


    const { localSearch, setLocalSearch, debounceMs } = useEntitySearch({ params, setParams });

    return (
        <EntitySearch
            value={localSearch}
            onChange={setLocalSearch}
            placeholder="Search workflows..."
        />
    );
}



export const WorkflowsPagination = () => {
    const [params, setParams] = useWorkFlowParams();
    const workflows = useSuspenseWorkFlows();


    const handlePageChange = (currentPage: number) => {
        setParams(prev => ({ ...prev, page: currentPage }))
    }
    return (
        <EntityPagination
            page={params.page}
            disabled={workflows.isFetching}
            onPageChange={handlePageChange}
            totalPages={workflows.data.totalPages}
        />
    );
}