import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useExecutionParams } from "./use-executions-params";


/**
 * Hook to fetch all Executions using suspense
 */
export function useSuspenseExecutions() {
    const trpc = useTRPC();
    const [params] = useExecutionParams();
    return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
}

export function useSuspenseGetOneExecution(id: string) {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
}