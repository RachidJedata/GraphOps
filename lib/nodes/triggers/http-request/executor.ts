import { NodeExecutor } from "@/types/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as kyOptions } from 'ky';

type HttpRequestData = {
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

    if (!data.endpoint) {
        throw new NonRetriableError("HTTP Request node: No endpoint configured");
    }

    const result = await step.run("http-request", async () => {
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: kyOptions = { method };

        if (["POST", "PUT", "PATCH"].includes(method) && data.body) {
            options.body = data.body;
        }

        const response = await ky(endpoint, options);

        const isJson = response.headers.get("content-type")?.includes("application/json");

        const responseData = isJson ? await response.json() : await response.text();

        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            }
        }
    });

    return result;
}