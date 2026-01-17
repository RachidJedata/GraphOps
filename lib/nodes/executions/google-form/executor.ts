import { googleFormChannel } from "@/inngest/channels/google-form";
import { NodeExecutor } from "@/types/executions/types";

type GoogleFormData = Record<string, unknown>;
export const GoogleFormTriggerExecutor: NodeExecutor<GoogleFormData> = async ({
    nodeId,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for http request
    await publish(googleFormChannel().status({
        nodeId,
        status: "loading",
    }));


    const result = await step.run("google-form-trigger", async () => context);

    //publish "success" state for http request
    await publish(googleFormChannel().status({
        nodeId,
        status: "success",
    }));

    return result;
}