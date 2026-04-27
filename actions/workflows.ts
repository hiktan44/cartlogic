"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { WorkflowNode, WorkflowEdge } from "@/types/workflow";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  template_id: z.string().uuid().optional(),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  nodes: z.array(z.unknown()).optional(),
  edges: z.array(z.unknown()).optional(),
});

export async function createWorkflowAction(data: {
  name: string;
  description?: string;
  template_id?: string;
}): Promise<{ workflow_id: string } | { error: string }> {
  const parsed = createSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  let initialNodes = "[]";
  let initialEdges = "[]";
  let template_id = parsed.data.template_id ?? null;

  if (template_id) {
    const { data: template } = await supabase
      .from("templates")
      .select("nodes, edges, use_count")
      .eq("id", template_id)
      .single();

    if (template) {
      initialNodes = JSON.stringify(template.nodes);
      initialEdges = JSON.stringify(template.edges);
      await supabase
        .from("templates")
        .update({ use_count: (template.use_count ?? 0) + 1 })
        .eq("id", template_id);
    }
  }

  const { data: workflow, error } = await supabase
    .from("workflows")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      nodes: initialNodes,
      edges: initialEdges,
      template_id,
    })
    .select("id")
    .single();

  if (error) return { error: "İş akışı oluşturulamadı." };

  revalidatePath("/workflows");
  return { workflow_id: workflow.id };
}

export async function updateWorkflowAction(data: {
  id: string;
  name?: string;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
}): Promise<{ success: boolean } | { error: string }> {
  const parsed = updateSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.name) updateData.name = parsed.data.name;
  if (data.nodes !== undefined) updateData.nodes = JSON.stringify(data.nodes);
  if (data.edges !== undefined) updateData.edges = JSON.stringify(data.edges);

  const { error } = await supabase
    .from("workflows")
    .update(updateData)
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return { error: "İş akışı güncellenemedi." };

  revalidatePath("/workflows");
  return { success: true };
}

const uuidSchema = z.string().uuid();

export async function deleteWorkflowAction(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  if (!uuidSchema.safeParse(id).success) return { error: "Geçersiz iş akışı ID'si." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const { error } = await supabase
    .from("workflows")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "İş akışı silinemedi." };

  revalidatePath("/workflows");
  return { success: true };
}

export async function publishWorkflowAction(
  id: string
): Promise<{ is_published: boolean } | { error: string }> {
  if (!uuidSchema.safeParse(id).success) return { error: "Geçersiz iş akışı ID'si." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const { data: existing } = await supabase
    .from("workflows")
    .select("is_published")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!existing) return { error: "İş akışı bulunamadı." };

  const newState = !existing.is_published;
  const { error } = await supabase
    .from("workflows")
    .update({
      is_published: newState,
      is_active: newState,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: "Yayın durumu güncellenemedi." };

  revalidatePath("/workflows");
  return { is_published: newState };
}
