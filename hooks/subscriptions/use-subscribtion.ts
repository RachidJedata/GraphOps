import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query"

export const useSubscription = () => {
    return useQuery({
        queryKey: ["subscription"],
        queryFn: async () => {
            const { data } = await authClient.customer.state();
            console.log("here again " + JSON.stringify(data));
            return data;
        }
    });
}

export const useHasActiveSubscription = () => {
    const { data: customerState, isLoading, ...rest } = useSubscription();

    const hasActiveSubscription = customerState?.activeSubscriptions && customerState.activeSubscriptions.length > 0;


    return {
        hasActiveSubscription,
        subscription: customerState?.activeSubscriptions[0],
        isLoading,
        ...rest
    };
}