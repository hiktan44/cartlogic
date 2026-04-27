import type { Node, Edge } from "@xyflow/react";

export type NodeType = "triggerNode" | "aiNode" | "actionNode" | "conditionNode";

export interface TriggerNodeData extends Record<string, unknown> {
  label: string;
  event: string;
}

export interface AINodeData extends Record<string, unknown> {
  label: string;
  model?: string;
  prompt?: string;
}

export interface ActionNodeData extends Record<string, unknown> {
  label: string;
  actionType?: string;
  listId?: string;
}

export interface ConditionNodeData extends Record<string, unknown> {
  label: string;
  condition: string;
}

export type WorkflowNode =
  | Node<TriggerNodeData, "triggerNode">
  | Node<AINodeData, "aiNode">
  | Node<ActionNodeData, "actionNode">
  | Node<ConditionNodeData, "conditionNode">;

export type WorkflowEdge = Edge;

export const SHOPIFY_EVENTS = [
  { value: "shopify.order.paid", label: "Sipariş Tamamlandı" },
  { value: "shopify.order.created", label: "Yeni Sipariş" },
  { value: "shopify.checkout.abandoned", label: "Sepet Terk Edildi" },
  { value: "shopify.review.created", label: "Yeni Ürün Yorumu" },
  { value: "shopify.customer.created", label: "Yeni Müşteri" },
] as const;

export const AI_MODELS = [
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Hızlı)" },
  { value: "gpt-4o", label: "GPT-4o (Güçlü)" },
  { value: "sentiment", label: "Duygu Analizi (Özel)" },
] as const;

export const ACTION_TYPES = [
  { value: "klaviyo.email", label: "Klaviyo: E-posta Gönder" },
  { value: "klaviyo.segment", label: "Klaviyo: Segmente Ekle" },
  { value: "email.notify", label: "E-posta: Bildirim Gönder" },
  { value: "shopify.discount", label: "Shopify: İndirim Kodu Oluştur" },
] as const;
