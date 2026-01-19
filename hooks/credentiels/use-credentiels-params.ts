import { credentielParams } from '@/lib/credientels/params';
import { useQueryStates } from 'nuqs'

export const useCredentielParams = () => {
    return useQueryStates(credentielParams);
}