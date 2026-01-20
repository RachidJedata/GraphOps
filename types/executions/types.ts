import { Realtime } from "@inngest/realtime";
import type { GetStepTools, Inngest } from "inngest";

export type WorkFlowContext = Record<string, unknown>;
export type StepTools = GetStepTools<Inngest.Any>;

export interface getNodeExecutorParams<TData = Record<string, unknown>> {
    data: TData,
    nodeId: string,
    context: WorkFlowContext,
    step: StepTools,
    userId: string;
    publish: Realtime.PublishFn,
}

export type NodeExecutor<TData = Record<string, unknown>> =
    (params: getNodeExecutorParams<TData>) => Promise<WorkFlowContext>;