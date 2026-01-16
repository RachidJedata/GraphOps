import { NodeExecutor } from "@/types/executions/types";
import { NodeType } from "../generated/prisma/enums";
import { ManualTriggerExecutor } from "../nodes/executions/manual-trigger/executor";
import { httpRequestExecutor } from "../nodes/triggers/http-request/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL]: ManualTriggerExecutor,

    [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,

}

export function getNodeExecutor(type: NodeType) {
    const executor = executorRegistry[type];
    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }
    return executor;
}