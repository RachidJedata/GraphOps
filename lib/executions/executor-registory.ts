import { NodeExecutor } from "@/types/executions/types";
import { NodeType } from "../generated/prisma/enums";
import { ManualTriggerExecutor } from "../nodes/executions/manual-trigger/executor";
import { httpRequestExecutor } from "../nodes/triggers/http-request/executor";
import { GoogleFormTriggerExecutor } from "../nodes/executions/google-form/executor";
import { StripeTriggerExecutor } from "../nodes/executions/stripe-trigger/executor";

export const executorRegistry: Partial<Record<NodeType, NodeExecutor>> = {
    [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerExecutor,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerExecutor,
}

export function getNodeExecutor(type: NodeType) {
    const executor = executorRegistry[type];
    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }
    return executor;
}