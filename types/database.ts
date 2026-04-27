export type Plan = "starter" | "pro" | "scale";
export type WorkflowStatus = "pending" | "running" | "success" | "failed";
export type IntegrationPlatform = "shopify" | "klaviyo";
export type TemplateCategory = "retention" | "acquisition" | "support" | "loyalty";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: Plan;
  task_count: number;
  task_limit: number;
  billing_cycle_start: string | null;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  user_id: string;
  platform: IntegrationPlatform;
  shop_domain: string | null;
  access_token: string;
  scopes: string[] | null;
  webhook_ids: Record<string, string>[];
  is_active: boolean;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  nodes: WorkflowNodeData[];
  edges: WorkflowEdgeData[];
  trigger_type: string | null;
  is_active: boolean;
  is_published: boolean;
  execution_count: number;
  last_executed_at: string | null;
  template_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecution {
  id: string;
  workflow_id: string;
  user_id: string;
  status: WorkflowStatus;
  trigger_data: Record<string, unknown> | null;
  result_data: Record<string, unknown> | null;
  error_message: string | null;
  tasks_used: number;
  started_at: string;
  completed_at: string | null;
}

export interface Template {
  id: string;
  name: string;
  description: string | null;
  category: TemplateCategory;
  nodes: WorkflowNodeData[];
  edges: WorkflowEdgeData[];
  preview_image_url: string | null;
  use_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface WorkflowNodeData {
  id: string;
  type: string;
  data: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface WorkflowEdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
}
