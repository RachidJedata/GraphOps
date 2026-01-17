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
            workflowId,
            formId: body.formId,
            formTitle: body.formTitle,
            responseId: body.responseId,
            timestamp: body.timestamp,
            respondentEmail: body.respondentEmail,
            responses: body.responses,
            raw: body,
        };

        //trigger an inngest job
        await sendWorkFlowExecution({
            workflowId,
            initialData: {
                googleForm: formData,
            }
        });

    } catch (error) {
        console.error("Google form webhook error: ", error);
        return NextResponse.json({
            success: false,
            error: `Failed to process google form submission : ${error}`,
        }, {
            status: 500,
        });
    }
}
export { handler as POST };