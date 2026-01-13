import { parseAsInteger, parseAsString, createLoader } from 'nuqs/server'
import { PAGINATION } from '../constants'

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const workFlowsParams = {
    page: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE)
        .withOptions({ clearOnDefault: true }),
    pageSize: parseAsInteger
        .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
        .withOptions({ clearOnDefault: true }),
    search: parseAsString
        .withDefault("")
        .withOptions({ clearOnDefault: true }),
}

export const workFlowsParamsLoader = createLoader(workFlowsParams)
