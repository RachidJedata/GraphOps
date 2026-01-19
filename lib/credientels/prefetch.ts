import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";


type Input = inferInput<typeof trpc.credientiels.getMany>;
/**
 * Prefetch All Credentiels
 */
export function prefetchCredentiels(params: Input) {
    return prefetch(trpc.credientiels.getMany.queryOptions(params));
}


/**
 * Prefetch a single credentiels
 * @param id the uuid of the credentiels
 */
export function prefetchCredentiel(id: string) {
    return prefetch(trpc.credientiels.getOne.queryOptions({ id }));
}