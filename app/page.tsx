import { requireAuth } from "@/lib/auth-utils";

export default async function Home() {
  await requireAuth();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      server component
    </div>
  );
}
