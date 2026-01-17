import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from 'ky';
import HandleBars from 'handlebars';
import { HttpRequestFormValues } from "@/components/editor/nodes/executions/http-request-node/dialog";
import { httpRequestChannel } from "@/inngest/channels/http-request";
import { NodeStatus } from "@/components/react-flow/node-status-indicator";




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
    await publish(httpRequestChannel().status({
        nodeId,
        status: "loading",
    }));

    const { body, endpoint, method, variableName } = data;

    if (!endpoint) {
        //publish "error" state for http request
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("HTTP Request node: No endpoint configured");
    }
    if (!variableName) {
        //publish "error" state for http request
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error",
        }));
        throw new NonRetriableError("HTTP Request node: No variable Name given");
    }

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
                    if (error instanceof Error && error.message.toLowerCase().includes("invalid"))
                        throw new NonRetriableError("json format in body is invalid");

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


            return {
                ...context,
                [variableName]: {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData,
                }
            }
        });

        //publish "success" state for http request
        await publish(httpRequestChannel().status({
            nodeId,
            status: "success",
        }));

        return result;
    } catch (error) {
        //publish "error" state for http request
        await publish(httpRequestChannel().status({
            nodeId,
            status: "error",
        }));

        throw error;
    }
}