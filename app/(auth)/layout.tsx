import { requireUnauth } from "@/lib/auth-utils"
import Image from "next/image"
import Link from "next/link";

export default async function Layout({ children }: { children: React.ReactNode }) {
    await requireUnauth();
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Left side: logo + form */}
            <div className="flex flex-col gap-4 p-6 md:p-10 md:pt-5">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <Image src="/logo.svg" width={180} height={180} alt="Logo" />
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {children}
                    </div>
                </div>
            </div>

            {/* Right side: wallpaper */}
            <div className="bg-muted relative hidden lg:block">
                <Image
                    src="/login-wallpaper.svg"
                    fill
                    alt="Signup wallpaper"
                    className="object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
