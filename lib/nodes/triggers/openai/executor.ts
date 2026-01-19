import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from 'handlebars';
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { openAIContextChannel, openAIStatusChannel } from "@/inngest/channels/openai";
import { OpenAIFormValues } from "@/components/editor/nodes/executions/openai/dialog";
import prisma from "@/lib/db";


HandleBars.registerHelper('json', (aString) => {
    const jsonString = JSON.stringify(aString, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});



export const openAIExecutor: NodeExecutor<Partial<OpenAIFormValues>> = async ({
    nodeId,
    data,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for http request
    await publish(openAIStatusChannel().status({
        nodeId,
        status: "loading",
    }));

    const { variableName, modelId, systemPrompt, userPrompt, credentialId } = data;

    if (!modelId) {
        //publish "error" state for openai
        await publish(openAIStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("OpenAI node: No model Id selected");
    }
    if (!variableName) {
        //publish "error" state for openai
        await publish(openAIStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("OpenAI node: No variable Name given");
    }
    if (!userPrompt) {
        //publish "error" state for openai
        await publish(openAIStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("OpenAI node: user prompt is required");
    }

    if (!credentialId) {
        //publish "error" state for Gemini
        await publish(openAIStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("OpenAI node: API KEY is required");
    }

    await publish(openAIContextChannel().context({
        nodeId,
        dataType: "inputData",
        data: context,
    }));


    try {

        const compiledSystemPrompt = systemPrompt ? HandleBars.compile(systemPrompt)(context) : "You are a helpful assistant.";
        const compiledUserPrompt = HandleBars.compile(userPrompt)(context);

        const credential = await step.run("get-credential", async () => {
            return await prisma.credientiels.findUnique({
                where: {
                    id: credentialId,
                }
            })
        });

        if (!credential) throw new NonRetriableError("OpenAI Node: API KEY is required")

        const openai = createOpenAI({
            apiKey: credential.value,
        });

        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openai(modelId),
                system: compiledSystemPrompt,
                prompt: compiledUserPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        )

        const firstStep = steps?.[0];
        const firstContent = firstStep?.content?.[0];
        const text = firstContent?.type === "text" ? firstContent.text : "";

        if (!text) {
            console.warn("OpenAI node: No text content in response");
        }

        //publish "success" state for http request
        await publish(openAIStatusChannel().status({
            nodeId,
            status: "success",
        }));

        const newContext = {
            ...context,
            [variableName]: text,
        };

        await publish(openAIContextChannel().context({
            nodeId,
            dataType: "outputData",
            data: newContext,
        }));


        return newContext

    } catch (error) {


        // Publish error state
        await publish(openAIStatusChannel().status({
            nodeId,
            status: "error",
        }));

        // Handle specific non-retriable errors
        if (error instanceof SyntaxError) {
            throw new NonRetriableError("OpenAI node: JSON format in body is invalid");
        }

        // Check if it's already a NonRetriableError
        if (error instanceof NonRetriableError) {
            throw error;
        }

        // For API errors that might be temporary (rate limits, network issues)
        // you might want to allow retries
        if (error instanceof Error && error.message.includes('rate limit')) {
            throw error; // Will retry
        }

        // All other errors are non-retriable
        const errorMessage = error instanceof Error
            ? error.message
            : "Unknown error occurred";

        throw new NonRetriableError(`OpenAI node: ${errorMessage}`);
    }

}
