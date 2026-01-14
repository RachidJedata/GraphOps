import type { NodeTypes } from "@xyflow/react";
import { NodeType } from "../generated/prisma/enums";
import InitialNode from "@/components/editor/initial-node";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
};
// } as const satisfies NodeTypes;

// export type RegisterNodeType = keyof typeof nodeComponents;