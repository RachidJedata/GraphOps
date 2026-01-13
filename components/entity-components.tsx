"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon } from "lucide-react";

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

type EntitySearchProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export function EntitySearch({
    value,
    onChange,
    placeholder = "Search...",
}: EntitySearchProps) {
    return (
        <div
            className={cn(
                "relative flex w-full max-w-sm items-center"
            )}
        >
            {/* Icon */}
            <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />

            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    "h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm",
                    "placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
                    "transition"
                )}
            />
        </div>
    );
}



type EntityPaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
};

export function EntityPagination({
    page,
    totalPages,
    onPageChange,
    disabled = false,
}: EntityPaginationProps) {
    if (totalPages <= 1) return null;

    const canPrev = page > 1;
    const canNext = page < totalPages;

    const getPages = () => {
        const pages: (number | "...")[] = [];

        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (page > 3) pages.push("...");

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) pages.push("...");

        pages.push(totalPages);

        return pages;
    };

    return (
        <div className="flex items-center justify-between gap-4">
            {/* Page info */}
            <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-1">
                {/* Previous */}
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={!canPrev || disabled}
                    className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm transition",
                        "hover:bg-accent hover:text-accent-foreground",
                        "disabled:pointer-events-none disabled:opacity-50"
                    )}
                    aria-label="Previous page"
                >
                    <ChevronLeftIcon className="h-4 w-4" />
                </button>

                {/* Pages */}
                {getPages().map((p, i) =>
                    p === "..." ? (
                        <span
                            key={`ellipsis-${i}`}
                            className="px-2 text-sm text-muted-foreground"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            disabled={disabled}
                            className={cn(
                                "h-9 min-w-9 rounded-md border px-3 text-sm transition",
                                p === page
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "hover:bg-accent hover:text-accent-foreground",
                                "disabled:pointer-events-none disabled:opacity-50"
                            )}
                            aria-current={p === page ? "page" : undefined}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={!canNext || disabled}
                    className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm transition",
                        "hover:bg-accent hover:text-accent-foreground",
                        "disabled:pointer-events-none disabled:opacity-50"
                    )}
                    aria-label="Next page"
                >
                    <ChevronRightIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}