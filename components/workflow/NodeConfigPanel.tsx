"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SHOPIFY_EVENTS, AI_MODELS, ACTION_TYPES } from "@/types/workflow";
import type { WorkflowNode } from "@/types/workflow";

interface NodeConfigPanelProps {
  node: WorkflowNode | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

export function NodeConfigPanel({ node, onClose, onUpdate }: NodeConfigPanelProps) {
  if (!node) return null;

  function handleChange(key: string, value: string) {
    if (!node) return;
    onUpdate(node.id, { ...node.data, [key]: value });
  }

  return (
    <aside
      className="w-72 border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col"
      aria-label="Node konfigürasyonu"
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Node Ayarları
        </h3>
        <button
          onClick={onClose}
          aria-label="Paneli kapat"
          className="rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Input
          label="Node Adı"
          value={(node.data as Record<string, string>).label ?? ""}
          onChange={(e) => handleChange("label", e.target.value)}
          placeholder="Node adı girin..."
        />

        {node.type === "triggerNode" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Shopify Olayı
            </label>
            <select
              value={(node.data as Record<string, string>).event ?? ""}
              onChange={(e) => handleChange("event", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Shopify olayı seçin"
            >
              <option value="">Olay seçin...</option>
              {SHOPIFY_EVENTS.map((ev) => (
                <option key={ev.value} value={ev.value}>
                  {ev.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {node.type === "aiNode" && (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                AI Modeli
              </label>
              <select
                value={(node.data as Record<string, string>).model ?? ""}
                onChange={(e) => handleChange("model", e.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="AI modeli seçin"
              >
                <option value="">Model seçin...</option>
                {AI_MODELS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Prompt
              </label>
              <textarea
                value={(node.data as Record<string, string>).prompt ?? ""}
                onChange={(e) => handleChange("prompt", e.target.value)}
                rows={4}
                placeholder="AI'ya ne yapmasını istediğinizi yazın..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="AI prompt"
              />
            </div>
          </>
        )}

        {node.type === "actionNode" && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Aksiyon Tipi
            </label>
            <select
              value={(node.data as Record<string, string>).actionType ?? ""}
              onChange={(e) => handleChange("actionType", e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Aksiyon tipi seçin"
            >
              <option value="">Aksiyon seçin...</option>
              {ACTION_TYPES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {node.type === "conditionNode" && (
          <Input
            label="Koşul"
            value={(node.data as Record<string, string>).condition ?? ""}
            onChange={(e) => handleChange("condition", e.target.value)}
            placeholder="örn: sentiment == negative"
            hint="Koşul ifadesini girin"
          />
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 p-4">
        <Button variant="ghost" size="sm" onClick={onClose} className="w-full">
          Kapat
        </Button>
      </div>
    </aside>
  );
}
