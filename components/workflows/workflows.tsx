"use client"

import { useCreateWorkFlow, useSuspenseWorkFlows } from "@/hooks/workflows/use-workflows";
import { EntityContainer, EntityHeader } from "../entity-components";
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/lib/use-upgrade-modal";

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
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    );
}

