import type { GetStepTools, Inngest } from "inngest";

export type WorkFlowContext = Record<string, unknown>;
export type StepTools = GetStepTools<Inngest.Any>;

export interface getNodeExecutorParams<TData = Record<string, unknown>> {
    data: TData,
    nodeId: string,
    context: WorkFlowContext,
    step: StepTools,
}

export type NodeExecutor<TData = Record<string, unknown>> =
    (params: getNodeExecutorParams<TData>) => Promise<WorkFlowContext>;