import { inngest } from "./client";
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { generateText } from 'ai'

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const executeAI = inngest.createFunction(
    { id: "execute-ai" },
    { event: "execute/ai" },
    async ({ event, step }) => {

        const { steps } = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: "google/gemini-2.5-flash",
                system: "",
                prompt: "",
            }
        )

        return steps;
    },
);