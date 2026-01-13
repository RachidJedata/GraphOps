import { workFlowsParams } from '@/lib/workflows/params'
import { useQueryStates } from 'nuqs'

export const useWorkFlowParams = () => {
    return useQueryStates(workFlowsParams);
}