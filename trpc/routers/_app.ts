import { workFlowRouters } from '@/lib/workflows/routers';
import { createTRPCRouter } from '../init';
import { credentielRouters } from '@/lib/credientels/routers';

export const appRouter = createTRPCRouter({
    workflows: workFlowRouters,
    credientiels: credentielRouters,
});
// export type definition of API
export type AppRouter = typeof appRouter;