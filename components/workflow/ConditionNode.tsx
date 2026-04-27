"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import type { ConditionNodeData } from "@/types/workflow";

export function ConditionNode({ data, selected }: NodeProps<Node<ConditionNodeData>>) {
  const nodeData = data;
  return (
    <div
      className={`min-w-[180px] rounded-xl border-2 bg-amber-50 dark:bg-amber-950/40 transition-shadow ${
        selected
          ? "border-amber-500 shadow-lg shadow-amber-500/20"
          : "border-amber-300 dark:border-amber-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-amber-500 !w-3 !h-3 !border-2 !border-white"
        aria-label="Giriş bağlantısı"
      />
      <div className="flex items-center gap-2 rounded-t-xl bg-amber-500 px-3 py-2">
        <GitBranch className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        <span className="text-xs font-semibold text-white uppercase tracking-wide">Koşul</span>
      </div>
      <div className="px-3 py-3">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100 leading-tight">
          {nodeData.label}
        </p>
        {nodeData.condition && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-mono">
            {nodeData.condition}
          </p>
        )}
      </div>
      <Handle
        id="yes"
        type="source"
        position={Position.Right}
        style={{ top: "35%" }}
        className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white"
        aria-label="Evet dalı"
      />
      <Handle
        id="no"
        type="source"
        position={Position.Right}
        style={{ top: "65%" }}
        className="!bg-red-500 !w-3 !h-3 !border-2 !border-white"
        aria-label="Hayır dalı"
      />
    </div>
  );
}
