import AppSideBar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-utils";

export default async function Layout({ children }: { children: React.ReactNode }) {
    await requireAuth();
    return (
        <SidebarProvider>
            <AppSideBar />
            <SidebarInset className="bg-muted/20">
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}