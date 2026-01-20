import { workFlowRouters } from '@/lib/workflows/routers';
import { createTRPCRouter } from '../init';
import { credentielRouters } from '@/lib/credientels/routers';
import { executionRouters } from '@/lib/executions/routers';

export const appRouter = createTRPCRouter({
    workflows: workFlowRouters,
    credientiels: credentielRouters,
    executions: executionRouters,
});
// export type definition of API
export type AppRouter = typeof appRouter;