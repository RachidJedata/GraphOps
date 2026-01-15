import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";

export const editorAtome = atom<ReactFlowInstance | null>(null);