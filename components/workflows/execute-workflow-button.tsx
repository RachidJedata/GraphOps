import { FlaskConicalIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useExecuteWorkFlow } from "@/hooks/workflows/use-workflows";

export default function ExecuteWorkflowButton({ workFlowId }: { workFlowId: string }) {
    const executeWorkflow = useExecuteWorkFlow();

    const handleExecuteWorkFlow = () => {
        executeWorkflow.mutate({ id: workFlowId });
    }
    return (
        <Button size='lg' onClick={handleExecuteWorkFlow} disabled={executeWorkflow.isPending}>
            <FlaskConicalIcon className="size-4" />
            Execute Workflow
        </Button>
    );
}