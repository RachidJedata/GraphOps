
export default async function WorkFlow({ params }: { params: Promise<{ credentialId: string }> }) {

    return (
        <>
            Executions Page {(await params).credentialId}
        </>
    );
}