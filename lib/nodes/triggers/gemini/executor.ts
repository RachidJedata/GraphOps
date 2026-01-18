import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from 'handlebars';
import { geminiContextChannel, geminiStatusChannel } from "@/inngest/channels/gemini";
import { GeminiFormValues } from "@/components/editor/nodes/executions/gemini/dialog";
import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'


HandleBars.registerHelper('json', (aString) => {
    const jsonString = JSON.stringify(aString, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});


// const openai = createOpenAI();
// const anthropic = createAnthropic();


export const geminiExecutor: NodeExecutor<Partial<GeminiFormValues>> = async ({
    nodeId,
    data,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for http request
    await publish(geminiStatusChannel().status({
        nodeId,
        status: "loading",
    }));

    const { variableName, modelId, systemPrompt, userPrompt } = data;

    if (!modelId) {
        //publish "error" state for gemini
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Gemini node: No model Id selected");
    }
    if (!variableName) {
        //publish "error" state for gemini
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Gemini node: No variable Name given");
    }
    if (!userPrompt) {
        //publish "error" state for Gemini
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Gemini node: user prompt is required");
    }

    await publish(geminiContextChannel().context({
        nodeId,
        dataType: "inputData",
        data: context,
    }));


    try {

        const compiledSystemPrompt = systemPrompt ? HandleBars.compile(systemPrompt)(context) : "You are a helpful assistant.";
        const compiledUserPrompt = HandleBars.compile(userPrompt)(context);

        //fetch credientiels of the user

        const google = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
        });

        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google(modelId),
                system: compiledSystemPrompt,
                prompt: compiledUserPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true,
                },
            }
        )

        const text = steps[0].content[0].type === "text"
            ? steps[0].content[0].text
            : "";

        //publish "success" state for http request
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "success",
        }));

        const newContext = {
            [variableName]: text,
            ...context
        };

        await publish(geminiContextChannel().context({
            nodeId,
            dataType: "outputData",
            data: newContext,
        }));


        return newContext

    } catch (error) {


        // Publish error state
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
        }));

        // Handle specific non-retriable errors
        if (error instanceof SyntaxError) {
            throw new NonRetriableError("Gemini node: JSON format in body is invalid");
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

        throw new NonRetriableError(`Gemini node: ${errorMessage}`);
    }

}
