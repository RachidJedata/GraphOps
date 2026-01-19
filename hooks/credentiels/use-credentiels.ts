import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentielParams } from "./use-credentiels-params";
import { CredientielType } from "@/lib/generated/prisma/enums";
import { useRouter } from "next/navigation";
import { useUpgradeModal } from "@/lib/use-upgrade-modal";


/**
 * Hook to fetch all Credentiels using suspense
 */
export function useSuspenseCredentiels() {
    const trpc = useTRPC();
    const [params] = useCredentielParams();
    return useSuspenseQuery(trpc.credientiels.getMany.queryOptions(params));
}

export function useSuspenseGetOneCredentiel(id: string) {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credientiels.getOne.queryOptions({ id }));
}

export function useSuspenseGetCredentielsByType(type: CredientielType) {
    const trpc = useTRPC();
    return useQuery(trpc.credientiels.getByType.queryOptions({ type }));
}


export function useCreateCredentiel() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.credientiels.create.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Credentiels ${data.name} has been created`);
            queryClient.invalidateQueries(trpc.credientiels.getMany.queryFilter({}));
        },
        onError: (error) => {
            toast.error(`Failed to create a Credentiels: ${error.message}`);
        }
    }));
}

export function useUpdateCredentiel() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.credientiels.update.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Credentiels "${data.name}" saved successfully`);
            queryClient.invalidateQueries(trpc.credientiels.getOne.queryFilter({ id: data.id }));
        },
        onError: (error) => {
            toast.error(`Failed to update a Credentiels: ${error.message}`);
        }
    }));
}




export function useRemoveCredentiels() {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.credientiels.remove.mutationOptions({
        onSuccess: (data) => {
            toast.success(`Credentiels ${data.name} has been deleted`);
            queryClient.invalidateQueries(trpc.credientiels.getMany.queryFilter({}));
        },
        onError: (error) => {
            toast.error(`Failed to remove a Credentiels: ${error.message}`);
        }
    }));
}

