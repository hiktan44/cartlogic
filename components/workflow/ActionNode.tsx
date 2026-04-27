"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Play } from "lucide-react";
import type { ActionNodeData } from "@/types/workflow";

export function ActionNode({ data, selected }: NodeProps<Node<ActionNodeData>>) {
  const nodeData = data;
  return (
    <div
      className={`min-w-[180px] rounded-xl border-2 bg-emerald-50 dark:bg-emerald-950/40 transition-shadow ${
        selected
          ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
          : "border-emerald-300 dark:border-emerald-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-white"
        aria-label="Giriş bağlantısı"
      />
      <div className="flex items-center gap-2 rounded-t-xl bg-emerald-500 px-3 py-2">
        <Play className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        <span className="text-xs font-semibold text-white uppercase tracking-wide">Aksiyon</span>
      </div>
      <div className="px-3 py-3">
        <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100 leading-tight">
          {nodeData.label}
        </p>
        {nodeData.actionType && (
          <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{nodeData.actionType}</p>
        )}
      </div>
    </div>
  );
}
