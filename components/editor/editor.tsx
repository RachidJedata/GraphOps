"use client"

import { useSuspenseGetOneWorkFlow } from "@/hooks/workflows/use-workflows";
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, type NodeChange, type EdgeChange, type Connection, Background, MiniMap, Controls, Panel } from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { nodeComponents } from "@/lib/editor/node-components";
import { AddNodeButton } from "./add-node";
import { useSetAtom } from "jotai";
import { editorAtome } from "@/lib/atoms";



export function Editor({ workFlowId }: { workFlowId: string }) {
    const { data: workFlow } = useSuspenseGetOneWorkFlow(workFlowId);

    const [nodes, setNodes] = useState<Node[]>(workFlow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workFlow.edges);

    const setEditor = useSetAtom(editorAtome);



    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        [],
    );

    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={nodeComponents}
                onInit={setEditor}
                deleteKeyCode={["Delete", "Backspace"]}
                snapGrid={[10,10]}
                snapToGrid
                panOnScroll
                // panOnDrag={false}
                // selectionOnDrag
            // proOptions={{
            //     hideAttribution: true,
            // }}
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>
            </ReactFlow>
        </div>
    );
}