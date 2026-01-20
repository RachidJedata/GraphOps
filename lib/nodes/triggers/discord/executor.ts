import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from 'handlebars';
import { discordContextChannel, discordStatusChannel } from "@/inngest/channels/discord";
import { DiscordFormValues } from "@/components/editor/nodes/executions/discord/dialog";
import { decode } from 'html-entities';
import ky from 'ky';


HandleBars.registerHelper('json', (aString) => {
    const jsonString = JSON.stringify(aString, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});


// const openai = createOpenAI();
// const anthropic = createAnthropic();


export const DiscordExecutor: NodeExecutor<Partial<DiscordFormValues>> = async ({
    nodeId,
    data,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for http request
    await publish(discordStatusChannel().status({
        nodeId,
        status: "loading",
    }));

    const { variableName, content, username, webhookUrl } = data;

    if (!content) {
        //publish "error" state for Discord
        await publish(discordStatusChannel().status({
            nodeId,
            status: "error",
            error: "Discord node: message content is required",
        }));
        throw new NonRetriableError("Discord node: message content is required ");
    }
    if (!variableName) {
        //publish "error" state for Discord
        await publish(discordStatusChannel().status({
            nodeId,
            status: "error",
            error: "Discord node: No variable Name given",
        }));
        throw new NonRetriableError("Discord node: No variable Name given");
    }
    if (!webhookUrl) {
        //publish "error" state for Discord
        await publish(discordStatusChannel().status({
            nodeId,
            status: "error",
            error: "Discord node: webhook URL is required",
        }));
        throw new NonRetriableError("Discord node: webhook URL is required");
    }


    await publish(discordContextChannel().context({
        nodeId,
        dataType: "inputData",
        data: context,
    }));


    try {

        const rawContent = HandleBars.compile(content)(context);
        //way handlebar will compile won't be compatible with discord
        const messageContent = decode(rawContent);

        const botName = username ? decode(HandleBars.compile(username)(context)) : undefined;

        const result = await step.run("discord-webhook", async () => {
            await ky.post(webhookUrl, {
                json: {
                    content: messageContent.slice(0, 2000),//discord max length
                    username: botName,
                }
            });

            const newContext = {
                ...context,
                [variableName]: content,
            };

            await publish(discordContextChannel().context({
                nodeId,
                dataType: "outputData",
                data: newContext,
            }));

            return newContext;
        })


        await publish(discordStatusChannel().status({
            nodeId,
            status: "success"
        }));


        return result;

    } catch (error) {


        // Publish error state
        await publish(discordStatusChannel().status({
            nodeId,
            status: "error",
            error: "Discord node: JSON format in body is invalid",
        }));

        // Handle specific non-retriable errors
        if (error instanceof SyntaxError) {
            throw new NonRetriableError("Discord node: JSON format in body is invalid");
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

        throw new NonRetriableError(`Discord node: ${errorMessage}`);
    }

}
