import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkFlowParams } from "./use-workflows-params";
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/lib/use-upgrade-modal";


/**
 * Hook to fetch all workflows using suspense
 */
export function useSuspenseWorkFlows() {
    const trpc = useTRPC();
    const [params] = useWorkFlowParams();
    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

export function useSuspenseGetOneWorkFlow(id: string) {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
}

export function useCreateWorkFlow() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`WorkFlow ${data.name} has been created`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        },
        onError: (error) => {
            toast.error(`Failed to create a workFlow: ${error.message}`);
        }
    }));
}

export function useUpdateNameWorkFlow() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess: (data) => {
            toast.success(`the New Name of WorkFlow is ${data.name} `);
            queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }));
        },
        onError: (error) => {
            toast.error(`Failed to update workFlow Name: ${error.message}`);
        }
    }));
}

export function useUpdateWorkFlow() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.update.mutationOptions({
        onSuccess: (data) => {
            toast.success(`WorkFlow "${data.name}" saved successfully`);
            queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }));
        },
        onError: (error) => {
            toast.error(`Failed to update a workFlow: ${error.message}`);
        }
    }));
}




export function useHandleCreateWorkflow() {
    const createWorkFlow = useCreateWorkFlow();
    const router = useRouter();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkFlow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (err) => {
                handleError(err);
            },
        });
    };

    return {
        handleCreate,
        modal,
        isLoading: createWorkFlow.isPending,
    };
}

export function useRemoveWorkFlow() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess: (data) => {
            toast.success(`WorkFlow ${data.name} has been deleted`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        },
        onError: (error) => {
            toast.error(`Failed to create a workFlow: ${error.message}`);
        }
    }));
}



export function useExecuteWorkFlow() {
    const trpc = useTRPC();

    return useMutation(trpc.workflows.execute.mutationOptions({
        onSuccess: () => {
            toast.success(`The workflow is executed successfully `);
        },
        onError: (error) => {
            toast.error(`Failed to execute workFlow Name: ${error.message}`);
        }
    }));
}
