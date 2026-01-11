import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session) redirect('/login');

    return session;
}

export async function requireUnauth() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(session) redirect('/');

}

