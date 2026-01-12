import { workFlowRouters } from '@/lib/workflows/routers';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
    workflows: workFlowRouters,
});
// export type definition of API
export type AppRouter = typeof appRouter;