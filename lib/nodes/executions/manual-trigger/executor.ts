import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { NodeExecutor } from "@/types/executions/types";

type ManualTriggerData = Record<string, unknown>;
export const ManualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
    nodeId,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for http request
    await publish(manualTriggerChannel().status({
        nodeId,
        status: "loading",
    }));


    const result = await step.run("manual-trigger", async () => context);

    //publish "success" state for http request
    await publish(manualTriggerChannel().status({
        nodeId,
        status: "success",
    }));

    return result;
}