
"use client";

import { PAGINATION } from "@/lib/constants";
import { useEffect, useState } from "react";

interface UseEntitySearchProps<T extends {
    search: string;
    page: number;
}> {
    params: T;
    setParams: (params: T) => void;
    debounceMs?: number;
}

export function useEntitySearch<T extends
    {
        search: string;
        page: number;
    }>({
        params,
        setParams,
        debounceMs = 500
    }: UseEntitySearchProps<T>) {


    const [localSearch, setLocalSearch] = useState(params.search);

    useEffect(() => {

        if (localSearch === "" && params.search !== "") {
            setParams({
                ...params,
                search: localSearch,
                page: PAGINATION.DEFAULT_PAGE
            });
            return;
        }

        const timer = setTimeout(() => {
            if (localSearch !== params.search) {
                setParams({
                    ...params,
                    search: localSearch,
                    page: PAGINATION.DEFAULT_PAGE
                });
            }
        }, debounceMs);

        return () => clearTimeout(timer);

    }, [params.search, localSearch, setParams, debounceMs]);

    useEffect(() => {
        setLocalSearch(params.search);
    }, [params.search]);

    return {
        localSearch,               // instant value (bind to input)
        setLocalSearch,            // onChange handler
        debounceMs,      // use for API / filtering
    };
}
