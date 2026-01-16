import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from 'ky';

type HttpRequestData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string | undefined;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
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

        if (["POST", "PUT", "PATCH"].includes(method ?? "GET") && body) {
            options.body = body;
            options.headers = {
                "Content-Type": "application/json",
            }
        }

        const response = await ky(endpoint, options);

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