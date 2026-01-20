import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from 'ky';
import HandleBars from 'handlebars';
import { HttpRequestFormValues } from "@/components/editor/nodes/executions/http-request-node/dialog";
import { httpRequestContextChannel, httpRequestStatusChannel } from "@/inngest/channels/http-request";




HandleBars.registerHelper('json', (aString) => {
    const jsonString = JSON.stringify(aString, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});

export const httpRequestExecutor: NodeExecutor<Partial<HttpRequestFormValues>> = async ({
    nodeId,
    data,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for http request
    await publish(httpRequestStatusChannel().status({
        nodeId,
        status: "loading",
    }));

    const { body, endpoint, method, variableName } = data;

    if (!endpoint) {
        //publish "error" state for http request
        await publish(httpRequestStatusChannel().status({
            nodeId,
            status: "error",
            error:"HTTP Request node: No endpoint configured"
        }));
        throw new NonRetriableError("HTTP Request node: No endpoint configured");
    }
    if (!variableName) {
        //publish "error" state for http request
        await publish(httpRequestStatusChannel().status({
            nodeId,
            status: "error",
            error:"HTTP Request node: No variable Name given",
        }));
        throw new NonRetriableError("HTTP Request node: No variable Name given");
    }

    await publish(httpRequestContextChannel().context({
        nodeId,
        dataType: "inputData",
        data: context,
    }));

    try {
        const result = await step.run("http-request", async () => {

            const options: kyOptions = { method: method ?? "GET" };

            if (["POST", "PUT", "PATCH"].includes(method ?? "GET")) {

                let resolved: string = "";
                try {
                    resolved = HandleBars.compile(body || "{}")(context);
                    //did that just to ensure it is a valid json
                    JSON.parse(resolved);
                } catch (error) {
                    if (error instanceof SyntaxError) {
                        throw new NonRetriableError("json format in body is invalid");
                    }
                    throw error;
                }

                options.body = resolved;
                options.headers = {
                    "Content-Type": "application/json",
                }
            }
            const compiledEndpoint = HandleBars.compile(endpoint)(context);

            const response = await ky(compiledEndpoint, options);

            const isJson = response.headers.get("content-type")?.includes("application/json");

            const responseData = isJson ? await response.json() : await response.text();


            const newContext = {
                ...context,
                [variableName]: {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData,
                },
            }
            await publish(httpRequestContextChannel().context({
                nodeId,
                dataType: "outputData",
                data: newContext,
            }));

            return newContext;
        });

        //publish "success" state for http request
        await publish(httpRequestStatusChannel().status({
            nodeId,
            status: "success",
        }));

        return result;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : "Unknown error occurred";

        //publish "error" state for http request
        await publish(httpRequestStatusChannel().status({
            nodeId,
            status: "error",
            error: errorMessage,
        }));

        throw error;
    }
}