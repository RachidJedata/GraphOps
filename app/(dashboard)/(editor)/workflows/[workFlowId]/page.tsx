
export default async function WorkFlow({ params }: { params: Promise<{ workFlowId: string }> }) {

    return (
        <>
            WorkFlows Page {(await params).workFlowId}
        </>
    );
}