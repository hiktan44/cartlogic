"use client";

import { Zap, Cpu, Play, GitBranch } from "lucide-react";

const nodeGroups = [
  {
    label: "Tetikleyiciler",
    color: "purple",
    items: [
      { type: "triggerNode", label: "Shopify Trigger", event: "shopify.order.paid" },
      { type: "triggerNode", label: "Sepet Terk", event: "shopify.checkout.abandoned" },
      { type: "triggerNode", label: "Yeni Yorum", event: "shopify.review.created" },
    ],
    icon: Zap,
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  {
    label: "AI İşlemleri",
    color: "orange",
    items: [
      { type: "aiNode", label: "Duygu Analizi", model: "sentiment" },
      { type: "aiNode", label: "E-posta Yaz", model: "gpt-4o-mini" },
      { type: "aiNode", label: "LTV Analizi", model: "gpt-4o-mini" },
    ],
    icon: Cpu,
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
  },
  {
    label: "Aksiyonlar",
    color: "emerald",
    items: [
      { type: "actionNode", label: "Klaviyo E-posta", actionType: "klaviyo.email" },
      { type: "actionNode", label: "Segmente Ekle", actionType: "klaviyo.segment" },
      { type: "actionNode", label: "İndirim Kodu", actionType: "shopify.discount" },
    ],
    icon: Play,
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  {
    label: "Koşullar",
    color: "amber",
    items: [
      { type: "conditionNode", label: "Eğer / Değilse", condition: "value == true" },
      { type: "conditionNode", label: "LTV Eşiği", condition: "ltv > 500" },
    ],
    icon: GitBranch,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-800",
  },
];

export function NodePalette() {
  function onDragStart(e: React.DragEvent, nodeType: string, nodeData: Record<string, string>) {
    e.dataTransfer.setData("application/reactflow", nodeType);
    e.dataTransfer.setData("application/nodedata", JSON.stringify(nodeData));
    e.dataTransfer.effectAllowed = "move";
  }

  return (
    <aside
      className="w-56 overflow-y-auto border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
      aria-label="Node paleti"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Node Tipleri
      </p>
      <div className="space-y-4">
        {nodeGroups.map((group) => (
          <div key={group.label}>
            <div className="mb-2 flex items-center gap-1.5">
              <group.icon className={`h-3.5 w-3.5 ${group.text}`} aria-hidden="true" />
              <span className={`text-xs font-semibold ${group.text}`}>{group.label}</span>
            </div>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.type, item as Record<string, string>)}
                  className={`cursor-grab rounded-lg border px-3 py-2 text-xs font-medium transition-opacity hover:opacity-80 active:cursor-grabbing ${group.bg} ${group.text} ${group.border}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.label} node'unu canvas'a sürükle`}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
