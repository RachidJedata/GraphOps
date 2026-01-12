import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


/**
 * Hook to fetch all workflows using suspense
 */
export function useSuspenseWorkFlows() {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
}

export function useCreateWorkFlow() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`WorkFlow ${data.name} has been created`);
            queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions());
        },
        onError: (error) => {
            toast.error(`Failed to create a workFlow: ${error.message}`);
        }
    }));
}