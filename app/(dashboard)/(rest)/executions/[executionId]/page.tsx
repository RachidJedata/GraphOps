
export default async function Execution({ params }: { params: Promise<{ executionId: string }> }) {

    return (
        <>
            Executions Page {(await params).executionId}
        </>
    );
}