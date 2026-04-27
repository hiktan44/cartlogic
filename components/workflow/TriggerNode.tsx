"use client";

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Zap } from "lucide-react";
import type { TriggerNodeData } from "@/types/workflow";

export function TriggerNode({ data, selected }: NodeProps<Node<TriggerNodeData>>) {
  return (
    <div
      className={`min-w-[180px] rounded-xl border-2 bg-purple-50 dark:bg-purple-950/40 transition-shadow ${
        selected
          ? "border-purple-500 shadow-lg shadow-purple-500/20"
          : "border-purple-300 dark:border-purple-700"
      }`}
    >
      <div className="flex items-center gap-2 rounded-t-xl bg-purple-500 px-3 py-2">
        <Zap className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        <span className="text-xs font-semibold text-white uppercase tracking-wide">Trigger</span>
      </div>
      <div className="px-3 py-3">
        <p className="text-sm font-medium text-purple-900 dark:text-purple-100 leading-tight">
          {data.label}
        </p>
        {data.event && (
          <p className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-mono">
            {data.event}
          </p>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-white"
        aria-label="Çıkış bağlantısı"
      />
    </div>
  );
}
