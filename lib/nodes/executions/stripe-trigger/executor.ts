import { stripeChannel } from "@/inngest/channels/stripe";
import { NodeExecutor } from "@/types/executions/types";

type StripeData = Record<string, unknown>;
export const StripeTriggerExecutor: NodeExecutor<StripeData> = async ({
    nodeId,
    context,
    step,
    publish,
}) => {

    //publish "loading" state for stripe
    await publish(stripeChannel().status({
        nodeId,
        status: "loading",
    }));


    const result = await step.run("stripe-trigger", async () => context);

    //publish "success" state for stripe
    await publish(stripeChannel().status({
        nodeId,
        status: "success",
    }));

    return result;
}