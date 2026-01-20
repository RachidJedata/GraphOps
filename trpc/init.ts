import { useHasActiveSubscription } from '@/hooks/subscriptions/use-subscribtion';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar-client';
import { initTRPC, TRPCError } from '@trpc/server';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
    /**
     * @see: https://trpc.io/docs/server/context
     */
    return { userId: 'user_123' };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
    /**
     * @see https://trpc.io/docs/server/data-transformers
     */
    transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session)
        return next({ ctx: { ...ctx, auth: session } });

    throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized Access",
    })

});

export const premiumProcedure = protectedProcedure.use(
    async ({ ctx, next }) => {
        try {
            const customer = await polarClient.customers.getStateExternal({
                externalId: ctx.auth.user.id,
            });

            // If no active subscriptions
            if (!customer.activeSubscriptions || customer.activeSubscriptions.length === 0) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You have to subscribe for this service",
                });
            }

            return next({ ctx: { ...ctx, customer } });
        } catch (err: any) {
            // Check if it's a Polar "Not found" error
            if (err.error === "ResourceNotFound") {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You have to subscribe for this service",
                });
            }

            // Wrap any other errors as internal server error
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: err?.message || "Unknown server error",
            });
        }
    }
);
