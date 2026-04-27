"use client";

import { useCallback, useState, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type NodeTypes,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { TriggerNode } from "./TriggerNode";
import { AINode } from "./AINode";
import { ActionNode } from "./ActionNode";
import { ConditionNode } from "./ConditionNode";
import { NodeConfigPanel } from "./NodeConfigPanel";
import type { WorkflowNode, WorkflowEdge } from "@/types/workflow";

const nodeTypes: NodeTypes = {
  triggerNode: TriggerNode as unknown as NodeTypes[string],
  aiNode: AINode as unknown as NodeTypes[string],
  actionNode: ActionNode as unknown as NodeTypes[string],
  conditionNode: ConditionNode as unknown as NodeTypes[string],
};

interface WorkflowCanvasProps {
  initialNodes: WorkflowNode[];
  initialEdges: WorkflowEdge[];
  onSave?: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  readOnly?: boolean;
}

export function WorkflowCanvas({
  initialNodes,
  initialEdges,
  onSave,
  readOnly = false,
}: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData("application/reactflow");
      const rawData = event.dataTransfer.getData("application/nodedata");
      if (!type) return;

      const nodeData = rawData ? (JSON.parse(rawData) as Record<string, string>) : {};
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 90,
        y: event.clientY - bounds.top - 40,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: type as WorkflowNode["type"],
        position,
        data: nodeData as WorkflowNode["data"],
      } as WorkflowNode;

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: WorkflowNode) => {
      setSelectedNode(node);
    },
    []
  );

  const onNodeUpdate = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? ({ ...n, data: data as WorkflowNode["data"] } as WorkflowNode) : n
        )
      );
    },
    [setNodes]
  );

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(nodes as WorkflowNode[], edges as WorkflowEdge[]);
    }
  }, [nodes, edges, onSave]);

  return (
    <div className="flex h-full" ref={reactFlowWrapper}>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          onDrop={readOnly ? undefined : onDrop}
          onDragOver={readOnly ? undefined : onDragOver}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          deleteKeyCode="Delete"
          aria-label="İş akışı canvas"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="currentColor"
            className="text-slate-200 dark:text-slate-700"
          />
          <Controls
            aria-label="Canvas kontrolleri"
            className="[&>button]:bg-white dark:[&>button]:bg-slate-800 [&>button]:border-slate-200 dark:[&>button]:border-slate-600"
          />
          <MiniMap
            className="!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 rounded-lg"
            nodeColor={(n) => {
              const colors: Record<string, string> = {
                triggerNode: "#8b5cf6",
                aiNode: "#f97316",
                actionNode: "#10b981",
                conditionNode: "#f59e0b",
              };
              return colors[n.type ?? ""] ?? "#94a3b8";
            }}
          />
        </ReactFlow>

        {onSave && !readOnly && (
          <button
            onClick={handleSave}
            className="absolute top-4 right-4 z-10 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Kaydet
          </button>
        )}
      </div>

      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={onNodeUpdate}
        />
      )}
    </div>
  );
}
