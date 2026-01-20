import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from 'handlebars';
import { geminiContextChannel, geminiStatusChannel } from "@/inngest/channels/gemini";
import { GeminiFormValues } from "@/components/editor/nodes/executions/gemini/dialog";
import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import prisma from "@/lib/db";
import { CredentialInfo, decrypt } from "@/lib/encryption";


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
    userId,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for http request
    await publish(geminiStatusChannel().status({
        nodeId,
        status: "loading",
    }));

    const { variableName, modelId, systemPrompt, userPrompt, credentialId } = data;

    if (!modelId) {
        //publish "error" state for gemini
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
            error: "Gemini node: No model Id selected",
        }));
        throw new NonRetriableError("Gemini node: No model Id selected");
    }
    if (!variableName) {
        //publish "error" state for gemini
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
            error: "Gemini node: No variable Name given",
        }));
        throw new NonRetriableError("Gemini node: No variable Name given");
    }
    if (!userPrompt) {
        //publish "error" state for Gemini
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
            error: "Gemini node: user prompt is required",
        }));
        throw new NonRetriableError("Gemini node: user prompt is required");
    }
    if (!credentialId) {
        //publish "error" state for Gemini
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
            error: "Gemini node: API KEY is required",
        }));
        throw new NonRetriableError("Gemini node: API KEY is required");
    }

    await publish(geminiContextChannel().context({
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
                    userId,
                }
            })
        });

        if (!credential) throw new NonRetriableError("Gemini Node: API KEY is required")

        const apiKey = decrypt(credential.value as CredentialInfo);

        //fetch credientiels of the user
        const google = createGoogleGenerativeAI({ apiKey });


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

        const firstStep = steps?.[0];
        const firstContent = firstStep?.content?.[0];
        const text = firstContent?.type === "text" ? firstContent.text : "";

        if (!text) {
            console.warn("Gemini node: No text content in response");
        }

        //publish "success" state for http request
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "success",
        }));

        const newContext = {
            ...context,
            [variableName]: text,
        };

        await publish(geminiContextChannel().context({
            nodeId,
            dataType: "outputData",
            data: newContext,
        }));


        return newContext

    } catch (error) {
        // All other errors are non-retriable
        const errorMessage = error instanceof Error
            ? error.message
            : "Unknown error occurred";

        // Publish error state
        await publish(geminiStatusChannel().status({
            nodeId,
            status: "error",
            error: errorMessage,
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



        throw new NonRetriableError(`Gemini node: ${errorMessage}`);
    }

}
