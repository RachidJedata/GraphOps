import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";


type Input = inferInput<typeof trpc.workflows.getMany>;
/**
 * Prefetch All WorkFlows
 */
export function prefetchWorkFlows(params: Input) {
    return prefetch(trpc.workflows.getMany.queryOptions(params));
}