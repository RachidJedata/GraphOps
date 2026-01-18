"use client";

import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import "react-json-view-lite/dist/index.css";

interface HttpRequestNodeDialogProps {
    children: React.ReactNode;
    inputData?: any;
    outputData?: any;
    setShowDialog: (show: boolean) => void;
    open: boolean;
    title: string;
    description: string;
}

export default function BaseNodeDialogContext({
    children,
    inputData,
    outputData,
    open,
    setShowDialog,
    description,
    title,
}: HttpRequestNodeDialogProps) {
    const isFullScreen = inputData || outputData;

    return (
        <Dialog open={open} onOpenChange={setShowDialog}>
            <DialogContent
                maxScreen={isFullScreen}
                className="
            max-w-none w-full min-h-auto
            p-0 flex flex-col
            "
            >
                {/* ===== Header ===== */}
                <DialogHeader className="px-6">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                {/* <Separator /> */}

                {/* ===== Main Content ===== */}
                <div className="flex-1 min-h-0 p-4 pt-0 border rounded-lg">
                    <div
                        className={`
                grid h-full gap-4
                ${isFullScreen ? 'grid-cols-[1fr_420px_1fr]' : 'grid-cols-1'}
                `}
                    >
                        {/* ===== Input ===== */}

                        {inputData && (
                            <section className="flex flex-col border rounded-lg overflow-hidden">
                                <header className="px-3 py-2 border-b text-sm font-semibold">
                                    Input Data
                                </header>
                                <div className="flex-1 overflow-auto p-2 text-xs">
                                    <JsonView
                                        data={inputData}
                                        shouldExpandNode={allExpanded}
                                        style={defaultStyles}
                                    />
                                </div>
                            </section>
                        )}

                        {/* ===== children (Form) ===== */}
                        <main className="flex-1 min-w-auto">
                            {children}
                        </main>


                        {outputData && (
                            <section className="flex flex-col border rounded-lg overflow-hidden">
                                <header className="px-3 py-2 border-b text-sm font-semibold">
                                    Output Data
                                </header>

                                <div className="flex-1 overflow-auto p-2 text-xs">
                                    <JsonView
                                        data={outputData}
                                        shouldExpandNode={allExpanded}
                                        style={defaultStyles}
                                    />
                                </div>
                            </section>
                        )}

                        {/* ===== Output ===== */}

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}