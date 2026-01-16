import { Connection, Node } from "@/lib/generated/prisma/client";
import { NonRetriableError } from "inngest";
import toposort from "toposort";

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[],
): Node[] => {
    // If no connections, return nodes as is (they're all independent)
    if (connections.length === 0) {
        return nodes;
    }


    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId,
    ]);

    //Add nodes with no edges to the edges list to ensure they are included in the sort
    const nodeIds = new Set(nodes.map((node) => node.id));
    const connectedNodeIds = new Set<string>();

    edges.forEach(([from, to]) => {
        connectedNodeIds.add(from);
        connectedNodeIds.add(to);
    });

    nodeIds.forEach((nodeId) => {
        if (!connectedNodeIds.has(nodeId)) {
            // Node has no connections, add a self-loop to include it in the sort
            edges.push([nodeId, nodeId]);
        }
    });

    let sortedNodeIds: string[];
    try {
        sortedNodeIds = toposort(edges);
        // remove duplicates from self-edges
        sortedNodeIds = Array.from(new Set(sortedNodeIds));
    } catch (error) {
        if (error instanceof Error && error.message.includes("Cyclic dependency")) {
            throw new NonRetriableError(`Cyclic dependency detected in workflow nodes.`);
        }
        throw error;
    }


    // Map node IDs to nodes for quick lookup
    const nodeMap = new Map<string, Node>(nodes.map(node => [node.id, node]));

    return sortedNodeIds.map(id => nodeMap.get(id)!).filter(Boolean);

}