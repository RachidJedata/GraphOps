"use client"

import { useHandleCreateWorkflow, useRemoveWorkFlow, useSuspenseWorkFlows } from "@/hooks/workflows/use-workflows";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch } from "../entity-components";
import { useWorkFlowParams } from "@/hooks/workflows/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { WorkFlow } from "@/lib/generated/prisma/client";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export default function WorkFlowsList() {
    const { data: workflows } = useSuspenseWorkFlows();

    return (
        <EntityList
            items={workflows.items}
            getKey={(wf) => wf.id}
            emptyView={<EmptyWorkFlow />}
            renderItem={(workFlow) => <WorkFlowItem workFlow={workFlow} />}
        />
    );
}

export const WorkflowsHeader = ({ disabled }: { disabled: boolean }) => {
    const { handleCreate, isLoading, modal } = useHandleCreateWorkflow();
    return (
        <>
            {modal}
            <EntityHeader
                title="WorkFlows"
                description="Create and manage your workflows"
                onNew={handleCreate}
                newButtonLabel="New WorkFlow"
                disabled={disabled}
                isCreating={isLoading}
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


export const EmptyWorkFlow = () => {
    const { handleCreate, modal } = useHandleCreateWorkflow();

    return <>
        {modal}
        <EmptyView
            entity="workflows"
            actionLabel="Create workflow"
            onAction={handleCreate}
            learnMoreHref="/docs/workflows"
        />
    </>

}

const WorkFlowItem = ({ workFlow }: { workFlow: WorkFlow }) => {

    const removeWorkFlow = useRemoveWorkFlow();

    return (
        <EntityItem
            key={workFlow.id}
            href={`/workflows/${workFlow.id}`}
            title={workFlow.name}
            subtitle={
                <>
                    {workFlow.createdAt.toString() !== workFlow.updatedAt.toString() &&
                        (
                            <>
                                Updated
                                {formatDistanceToNow(workFlow.updatedAt, { addSuffix: true })}
                                &bull;
                            </>
                        )
                    }
                    Created {" "}
                    {formatDistanceToNow(workFlow.createdAt, { addSuffix: true })} {" "}

                </>
            }
            image={
                <div className="size-8 flex items-center justify-center">
                    <WorkflowIcon className="size-5 text-muted-foreground rounded-sm" />
                </div>
            }
            onRemove={() => removeWorkFlow.mutate({ id: workFlow.id })}
            isRemoving={removeWorkFlow.isPending}
        />
    )
}