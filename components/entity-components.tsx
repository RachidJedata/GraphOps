"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { AlertTriangleIcon, ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon, FolderCodeIcon, Loader2Icon, PlusIcon, SearchIcon, Trash2Icon, XIcon } from "lucide-react";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "./ui/button";
import React from "react";
import { Card } from "./ui/card";
import { useSuspenseWorkFlows } from "@/hooks/workflows/use-workflows";

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

    const workflows = useSuspenseWorkFlows();

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
                <div className="border-border px-6 pt-3 pb-1 justify-end flex">
                    {search}
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 overflow-auto px-6 py-4">
                {children}
            </div>

            {/* Pagination / Footer */}
            {pagination && workflows.data.totalPages > 1 && (
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


interface StateViewProps {
    message?: string;
}

interface LoadingViewProps extends StateViewProps {
    entity?: string;
}

export const LoadingView = ({
    entity,
    message,
}: LoadingViewProps) => {
    const label =
        message ??
        (entity ? `Loading ${entity}…` : "Loading…");

    return (
        <div
            className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-3",
                "rounded-lg border border-dashed border-border bg-background p-8 text-center"
            )}
        >
            {/* Spinner */}
            <Loader2Icon className="h-6 w-6 animate-spin text-primary" />

            {/* Text */}
            <p className="text-sm font-medium text-muted-foreground">
                {label}
            </p>
        </div>
    );
};



interface ErrorViewProps extends StateViewProps {
    entity?: string;
    onRetry?: () => void;
}

export const ErrorView = ({
    entity,
    message,
    onRetry,
}: ErrorViewProps) => {
    const label =
        message ??
        (entity
            ? `Failed to load ${entity}. Please try again.`
            : "Something went wrong. Please try again.");

    return (
        <div
            className={cn(
                "flex h-full w-full flex-col items-center justify-center gap-3",
                "rounded-lg border border-dashed border-destructive/40",
                "bg-background p-8 text-center"
            )}
        >
            {/* Icon */}
            <AlertTriangleIcon className="h-6 w-6 text-destructive" />

            {/* Message */}
            <p className="max-w-md text-sm font-medium text-muted-foreground">
                {label}
            </p>

            {/* Action */}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className={cn(
                        "mt-2 inline-flex items-center rounded-lg border border-input",
                        "px-4 py-2 text-sm font-medium transition",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary/40"
                    )}
                >
                    Retry
                </button>
            )}
        </div>
    );
};




interface EmptyViewProps extends StateViewProps {
    entity?: string;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    learnMoreHref?: string;
}

export function EmptyView({
    entity,
    message,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    learnMoreHref,
}: EmptyViewProps) {
    const title = entity ? `No ${entity} Found` : "Nothing here yet";
    const description =
        message ??
        (entity
            ? `Haven’t found any ${entity} `
            : "There’s no data to display right now.");

    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderCodeIcon />
                </EmptyMedia>

                <EmptyTitle>{title}</EmptyTitle>

                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>

            {(onAction || onSecondaryAction) && (
                <EmptyContent>
                    <div className="flex gap-2">
                        {onAction && actionLabel && (
                            <Button onClick={onAction}>
                                <PlusIcon />
                                {actionLabel}
                            </Button>
                        )}

                        {onSecondaryAction && secondaryActionLabel && (
                            <Button
                                variant="outline"
                                onClick={onSecondaryAction}
                            >
                                {secondaryActionLabel}
                            </Button>
                        )}
                    </div>
                </EmptyContent>
            )}

            {learnMoreHref && (
                <Button
                    variant="link"
                    asChild
                    className="text-primary"
                    size="sm"
                >
                    <a href={learnMoreHref}>
                        Learn more <ArrowUpRightIcon className="h-4 w-4" />
                    </a>
                </Button>
            )}
        </Empty>
    );
}

interface EntityListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    getKey?: (item: T, index: number) => string | number;
    emptyView?: React.ReactNode;
    className?: string;
}



export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className,
}: EntityListProps<T>) {
    if (!items || items.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                {emptyView ?? null}
            </div>
        );
    }

    return (
        <div
            className={cn(className, "flex flex-col gap-2")}
        >
            {items.map((item, index) => (
                <React.Fragment
                    key={
                        getKey
                            ? getKey(item, index)
                            : index
                    }
                >
                    {renderItem(item, index)}
                </React.Fragment>
            ))}
        </div>
    );
}


interface EntityItemProps {
    href: string;
    title: string;
    subtitle?: React.ReactNode;
    image?: React.ReactNode;
    actions?: React.ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
}


export const EntityItem: React.FC<EntityItemProps> = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving = false,
    className = '',
}) => {
    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onRemove && !isRemoving) {
            await onRemove();
        }
    };

    return (
        <Card className={`group relative px-6 py-3 overflow-hidden transition-all hover:shadow-md ${className}`}>
            <Link
                href={href}
                className="flex items-center gap-4 no-underline text-inherit"
                onClick={(e) => {
                    if (isRemoving) e.preventDefault();
                }}
            >
                {/* Image Section */}
                {image && (
                    <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {image}
                    </div>
                )}

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate mb-1">
                        {title}
                    </h3>
                    {subtitle && (
                        <div className="text-sm text-gray-600 line-clamp-2">
                            {subtitle}
                        </div>
                    )}
                </div>

                {/* Actions Section */}
                {actions && (
                    <div className="shrink-0 flex items-center gap-2">
                        {actions}
                    </div>
                )}

                {/* Remove Button */}
                {onRemove && (
                    <div className="shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRemove}
                            disabled={isRemoving}
                            aria-label="Remove"
                        >
                            {isRemoving ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                                <XIcon className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                )}
            </Link>

            {/* Loading Overlay */}
            {isRemoving && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
            )}
        </Card>
    );
};
