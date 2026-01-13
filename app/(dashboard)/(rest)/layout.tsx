import AppHeader from "@/components/app-header";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            <main className="flex-1">{children}</main>
        </>
    )
}