import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from 'ky';
import HandleBars from 'handlebars';
import { HttpRequestFormValues } from "@/components/editor/nodes/executions/http-request-node/dialog";


HandleBars.registerHelper('json', (aString) => {
    const jsonString = JSON.stringify(aString, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
});

export const httpRequestExecutor: NodeExecutor<HttpRequestFormValues> = async ({
    nodeId,
    data,
    context,
    step,
}) => {

    const { body, endpoint, method, variableName } = data;

    if (!endpoint) {
        throw new NonRetriableError("HTTP Request node: No endpoint configured");
    }
    if (!variableName) {
        throw new NonRetriableError("HTTP Request node: No variable Name given");
    }

    const result = await step.run("http-request", async () => {

        const options: kyOptions = { method: method ?? "GET" };

        if (["POST", "PUT", "PATCH"].includes(method ?? "GET")) {

            const resolved = HandleBars.compile(body || "{}")(context);
            console.log("Body : ", resolved);
            //did that just to ensure it is a valid json
            JSON.parse(resolved);

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

    return result;
}