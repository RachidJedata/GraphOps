import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import HandleBars from 'handlebars';
import { slackContextChannel, slackStatusChannel } from "@/inngest/channels/slack";
import { SlackFormValues } from "@/components/editor/nodes/executions/slack/dialog";
import { decode } from 'html-entities';
import ky from 'ky';


HandleBars.registerHelper('json', (aString) => {
    const jsonString = JSON.stringify(aString, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});


// const openai = createOpenAI();
// const anthropic = createAnthropic();


export const SlackExecutor: NodeExecutor<Partial<SlackFormValues>> = async ({
    nodeId,
    data,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for http request
    await publish(slackStatusChannel().status({
        nodeId,
        status: "loading",
    }));

    const { variableName, content, webhookUrl } = data;

    if (!content) {
        //publish "error" state for Slack
        await publish(slackStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Slack node: message content is required ");
    }
    if (!variableName) {
        //publish "error" state for Slack
        await publish(slackStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Slack node: No variable Name given");
    }
    if (!webhookUrl) {
        //publish "error" state for Slack
        await publish(slackStatusChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("Slack node: webhook URL is required");
    }


    await publish(slackContextChannel().context({
        nodeId,
        dataType: "inputData",
        data: context,
    }));


    try {

        const rawContent = HandleBars.compile(content)(context);
        //way handlebar will compile won't be compatible with slack
        const messageContent = decode(rawContent);

        const result = await step.run("slack-webhook", async () => {
            await ky.post(webhookUrl, {
                json: {
                    content: messageContent
                }
            });

            const newContext = {
                ...context,
                [variableName]: content,
            };

            await publish(slackContextChannel().context({
                nodeId,
                dataType: "outputData",
                data: newContext,
            }));

            return newContext;
        })


        await publish(slackStatusChannel().status({
            nodeId,
            status: "success"
        }));


        return result;

    } catch (error) {


        // Publish error state
        await publish(slackStatusChannel().status({
            nodeId,
            status: "error",
        }));

        // Handle specific non-retriable errors
        if (error instanceof SyntaxError) {
            throw new NonRetriableError("Slack node: JSON format in body is invalid");
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

        throw new NonRetriableError(`Slack node: ${errorMessage}`);
    }

}
