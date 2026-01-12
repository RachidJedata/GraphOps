"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel?: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
        | { onNew: () => void; newButtonHref?: never }
        | { onNew?: never; newButtonHref: string }
        | { onNew?: never; newButtonHref?: never }
    );

export function EntityHeader({
    title,
    description,
    newButtonLabel = "New",
    disabled = false,
    isCreating = false,
    onNew,
    newButtonHref,
}: EntityHeaderProps) {
    const showButton = Boolean(onNew || newButtonHref);

    const ButtonContent = (
        <>
            {isCreating ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : <PlusIcon className="h-4 w-4" />}
            <span>{isCreating ? "Creating…" : newButtonLabel}</span>
        </>
    );

    return (
        <div className="flex flex-col gap-4 border-b border-border bg-background px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Title & description */}
            <div className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    {title}
                </h1>
                {description && (
                    <p className="max-w-xl text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {/* Right: Action */}
            {showButton && (
                <div className="flex items-center gap-2">
                    {newButtonHref ? (
                        <Link
                            href={newButtonHref}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition",
                                "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40",
                                (disabled || isCreating) &&
                                "pointer-events-none opacity-60"
                            )}
                            prefetch
                        >
                            {ButtonContent}
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={onNew}
                            disabled={disabled || isCreating}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition",
                                "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40",
                                "disabled:pointer-events-none disabled:opacity-60"
                            )}
                        >
                            {ButtonContent}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}


type EntityContainerProps = {
    header?: React.ReactNode;
    search?: React.ReactNode;
    pagination?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};

export function EntityContainer({
    header,
    search,
    pagination,
    children,
    className,
}: EntityContainerProps) {
    return (
        <section
            className={cn(
                "flex h-full flex-col rounded-xl border border-border bg-background shadow-sm",
                className
            )}
        >
            {/* Header */}
            {header && (
                <div className="shrink-0">
                    {header}
                </div>
            )}

            {/* Search / Filters */}
            {search && (
                <div className="border-b border-border px-6 py-3">
                    {search}
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 overflow-auto px-6 py-4">
                {children}
            </div>

            {/* Pagination / Footer */}
            {pagination && (
                <div className="shrink-0 border-t border-border px-6 py-3">
                    {pagination}
                </div>
            )}
        </section>
    );
}
