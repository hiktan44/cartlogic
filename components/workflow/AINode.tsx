"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Cpu } from "lucide-react";
import type { AINodeData } from "@/types/workflow";

export function AINode({ data, selected }: NodeProps<Node<AINodeData>>) {
  const nodeData = data;
  return (
    <div
      className={`min-w-[180px] rounded-xl border-2 bg-orange-50 dark:bg-orange-950/40 transition-shadow ${
        selected
          ? "border-orange-500 shadow-lg shadow-orange-500/20"
          : "border-orange-300 dark:border-orange-700"
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-orange-500 !w-3 !h-3 !border-2 !border-white"
        aria-label="Giriş bağlantısı"
      />
      <div className="flex items-center gap-2 rounded-t-xl bg-orange-500 px-3 py-2">
        <Cpu className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        <span className="text-xs font-semibold text-white uppercase tracking-wide">AI</span>
      </div>
      <div className="px-3 py-3">
        <p className="text-sm font-medium text-orange-900 dark:text-orange-100 leading-tight">
          {nodeData.label}
        </p>
        {nodeData.model && (
          <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">{nodeData.model}</p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-orange-500 !w-3 !h-3 !border-2 !border-white"
        aria-label="Çıkış bağlantısı"
      />
    </div>
  );
}
