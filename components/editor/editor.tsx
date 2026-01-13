"use client"

import { useSuspenseGetOneWorkFlow } from "@/hooks/workflows/use-workflows";

export function Editor({ workFlowId }: { workFlowId: string }) {
    const { data: workflow } = useSuspenseGetOneWorkFlow(workFlowId);


    return (<>hhheh</>);
}