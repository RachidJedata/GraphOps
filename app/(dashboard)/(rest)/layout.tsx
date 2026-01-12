import AppHeader from "@/components/app-header";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            <main>{children}</main>
        </>
    )
}