import { sendWorkFlowExecution } from "@/inngest/utils";
import { NextResponse, NextRequest } from "next/server";


const handler = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const workflowId = url.searchParams.get("workFlowId");

        if (!workflowId) return NextResponse.json({
            success: false,
            error: `Missing required workflow id`,
        }, {
            status: 400,
        });

        const body = await req.json();

        const formData = {
            eventId: body.id,
            eventType: body.type,
            timestamp: body.created,
            livemode: body.livemode,
            raw: body.data?.object,
        };

        //trigger an inngest job
        await sendWorkFlowExecution({
            workflowId,
            initialData: {
                stripe: formData,
            }
        });

        return NextResponse.json({
            success: true,
        }, {
            status: 200,
        })

    } catch (error) {
        console.error("Stripe webhook error: ", error);
        return NextResponse.json({
            success: false,
            error: `Failed to process stripe event : ${error}`,
        }, {
            status: 500,
        });
    }
}
export { handler as POST };