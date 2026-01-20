import { executionParams } from '@/lib/executions/params';
import { useQueryStates } from 'nuqs'

export const useExecutionParams = () => {
    return useQueryStates(executionParams);
}