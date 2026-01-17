import { ManualTriggerNode } from "@/components/editor/nodes/triggers/manual-trigger-node/node";
import { NodeType } from "../generated/prisma/enums";
import InitialNode from "@/components/editor/nodes/base-nodes/initial-node";
import { HttpRequestNode } from "@/components/editor/nodes/executions/http-request-node/node";
import { GoogleFormTriggerNode } from "@/components/editor/nodes/triggers/google-form-node/node";
import { StripeTriggerNode } from "@/components/editor/nodes/triggers/stripe-trigger-node/node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,

};
// } as const satisfies NodeTypes;

// export type RegisterNodeType = keyof typeof nodeComponents;