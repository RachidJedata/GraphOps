import { NodeExecutor } from "@/types/executions/types";
import { NodeType } from "../generated/prisma/enums";
import { ManualTriggerExecutor } from "../nodes/executions/manual-trigger/executor";
import { httpRequestExecutor } from "../nodes/triggers/http-request/executor";
import { GoogleFormTriggerExecutor } from "../nodes/executions/google-form/executor";
import { StripeTriggerExecutor } from "../nodes/executions/stripe-trigger/executor";
import { geminiExecutor } from "../nodes/triggers/gemini/executor";
import { openAIExecutor } from "../nodes/triggers/openai/executor";
import { anthropicExecutor } from "../nodes/triggers/anthropic/executor";
import { DiscordExecutor } from "../nodes/triggers/discord/executor";
import { SlackExecutor } from "../nodes/triggers/slack/executor";

export const executorRegistry: Partial<Record<NodeType, NodeExecutor>> = {
    [NodeType.MANUAL_TRIGGER]: ManualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTriggerExecutor,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerExecutor,
    [NodeType.GEMINI]: geminiExecutor,
    [NodeType.OPENAI]: openAIExecutor,
    [NodeType.ANTHROPIC]: anthropicExecutor,
    [NodeType.DISCORD]: DiscordExecutor,
    [NodeType.SLACK]: SlackExecutor,

}

export function getNodeExecutor(type: NodeType) {
    const executor = executorRegistry[type];
    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }
    return executor;
}