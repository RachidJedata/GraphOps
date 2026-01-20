import { ManualTriggerNode } from "@/components/editor/nodes/triggers/manual-trigger-node/node";
import { NodeType } from "../generated/prisma/enums";
import InitialNode from "@/components/editor/nodes/base-nodes/initial-node";
import { HttpRequestNode } from "@/components/editor/nodes/executions/http-request-node/node";
import { GoogleFormTriggerNode } from "@/components/editor/nodes/triggers/google-form-node/node";
import { StripeTriggerNode } from "@/components/editor/nodes/triggers/stripe-trigger-node/node";
import { GeminiNode } from "@/components/editor/nodes/executions/gemini/node";
import { OpenAINode } from "@/components/editor/nodes/executions/openai/node";
import { anthropicNode } from "@/components/editor/nodes/executions/anthropic/node";
import { DiscordNode } from "@/components/editor/nodes/executions/discord/node";
import { SlackNode } from "@/components/editor/nodes/executions/slack/node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerNode,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
    [NodeType.GEMINI]: GeminiNode,
    [NodeType.ANTHROPIC]: anthropicNode,
    [NodeType.OPENAI]: OpenAINode,
    [NodeType.DISCORD]: DiscordNode,
    [NodeType.SLACK]: SlackNode,

};
// } as const satisfies NodeTypes;

// export type RegisterNodeType = keyof typeof nodeComponents;