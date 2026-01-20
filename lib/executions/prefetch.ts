import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";


type Input = inferInput<typeof trpc.executions.getMany>;
/**
 * Prefetch All Executions
 */
export function prefetchExecutions(params: Input) {
    return prefetch(trpc.executions.getMany.queryOptions(params));
}


/**
 * Prefetch a single exectuion
 * @param id the uuid of the exectuion
 */
export function prefetchExecution(id: string) {
    return prefetch(trpc.executions.getOne.queryOptions({ id }));
}