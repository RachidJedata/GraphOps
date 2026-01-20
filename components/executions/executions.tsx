"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination } from "../entity-components";
import { formatDistanceToNow } from 'date-fns';
import { useSuspenseExecutions } from "@/hooks/executions/use-executions";
import { useExecutionParams } from "@/hooks/executions/use-executions-params";
import Image from "next/image";
import { CredientielType } from "@/lib/generated/prisma/enums";
import { Execution, ExecutionStatus } from "@/lib/generated/prisma/client";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, LucideIcon, XCircleIcon } from "lucide-react";

export default function ExecutionsList() {
    const { data: executions } = useSuspenseExecutions();

    return (
        <EntityList
            items={executions.items}
            getKey={(cr) => cr.id}
            emptyView={<EmptyExecutions />}
            renderItem={(execution) => <ExecutionItem execution={execution} />}
        />
    );
}

export const ExecutionsHeader = () => {
    return (
        <EntityHeader
            title="Executions"
            description="History of your workflow executions"
        />
    );
}


export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<ExecutionsHeader />}
            pagination={<ExecutionsPagination />}
        >
            {children}
        </EntityContainer>
    );
}



export const ExecutionsPagination = () => {
    const [params, setParams] = useExecutionParams();
    const Executions = useSuspenseExecutions();


    const handlePageChange = (currentPage: number) => {
        setParams(prev => ({ ...prev, page: currentPage }))
    }
    return (
        <EntityPagination
            page={params.page}
            disabled={Executions.isFetching}
            onPageChange={handlePageChange}
            totalPages={Executions.data.totalPages}
        />
    );
}


export const EmptyExecutions = () => {
    return <>
        <EmptyView
            entity="Executions"
            message="Haven't found any executions, try running your workflow or create one"
            learnMoreHref="/docs/Executions"
        />
    </>

}

const ExecutionItem = ({ execution }:
    {
        execution: Execution & { workflow: { id: string; name: string; } }
    }) => {

    const duration = execution.completedAt ? Math.round(execution.completedAt.getTime() - execution.startedAt.getTime()) / 100 : null;
    return (
        <EntityItem
            key={execution.id}
            href={`/executions/${execution.id}`}
            title={execution.status}
            subtitle={<>
                {execution.workflow.name} &bull; Started {" "} {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
                {duration && (<>&bull; Took {duration}s</>)}
            </>}
            image={
                <div className="size-8 flex items-center justify-center">
                    {GetStatusIcon(execution.status)}
                </div>
            }
        />
    )
}

const GetStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case "SUCCESS":
            return <CheckCircle2Icon className="size-5 text-green-500 rounded-sm" />
        case "FAILED":
            return <XCircleIcon className="size-5 text-red-500 rounded-sm" />
        case "RUNNING":
            return <Loader2Icon className="size-5 text-primary animate-spin rounded-sm" />
        default:
            return <ClockIcon className="size-5 text-primary rounded-sm" />
    }
}