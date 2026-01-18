import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from 'handlebars';
import { anthropicContextChannel, anthropicStatusChannel } from "@/inngest/channels/anthropic";
import { generateText } from 'ai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { AnthropicFormValues } from "@/components/editor/nodes/executions/anthropic/dialog";


HandleBars.registerHelper('json', (aString) => {
    const jsonString = JSON.stringify(aString, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});


// const anthropic = createAnthropic();


export const anthropicExecutor: NodeExecutor<Partial<AnthropicFormValues>> = async ({
    nodeId,
    data,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for Anthropic
    await publish(anthropicStatusChannel().status({
        nodeId,
        status: "loading",
    }));

    const { variableName, modelId, systemPrompt, userPrompt } = data;

    if (!modelId) {
        //publish "error" state for anthropic
        await publish(anthropicStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Anthropic node: No model Id selected");
    }
    if (!variableName) {
        //publish "error" state for anthropic
        await publish(anthropicStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Anthropic node: No variable Name given");
    }
    if (!userPrompt) {
        //publish "error" state for anthropic
        await publish(anthropicStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Anthropic node: user prompt is required");
    }

    await publish(anthropicContextChannel().context({
        nodeId,
        dataType: "inputData",
        data: context,
    }));


    try {

        const compiledSystemPrompt = systemPrompt ? HandleBars.compile(systemPrompt)(context) : "You are a helpful assistant.";
        const compiledUserPrompt = HandleBars.compile(userPrompt)(context);

        //fetch credientiels of the user

        const anthropic = createAnthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });

        const { steps } = await step.ai.wrap(
            "anthropic-generate-text",
            generateText,
            {
                model: anthropic(modelId),
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
            console.warn("Anthropic node: No text content in response");
        }

        //publish "success" state for Anthropic
        await publish(anthropicStatusChannel().status({
            nodeId,
            status: "success",
        }));

        const newContext = {
            ...context,
            [variableName]: text,
        };

        await publish(anthropicContextChannel().context({
            nodeId,
            dataType: "outputData",
            data: newContext,
        }));


        return newContext

    } catch (error) {


        // Publish error state
        await publish(anthropicStatusChannel().status({
            nodeId,
            status: "error",
        }));

        // Handle specific non-retriable errors
        if (error instanceof SyntaxError) {
            throw new NonRetriableError("Anthropic node: JSON format in body is invalid");
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

        throw new NonRetriableError(`Anthropic node: ${errorMessage}`);
    }

}
