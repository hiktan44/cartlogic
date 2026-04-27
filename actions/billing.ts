"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Plan } from "@/types/database";

export async function checkTaskLimitAction(): Promise<{
  used: number;
  limit: number;
  plan: Plan;
  can_execute: boolean;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { used: 0, limit: 100, plan: "starter", can_execute: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("task_count, task_limit, plan")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { used: 0, limit: 100, plan: "starter", can_execute: false };
  }

  const plan = profile.plan as Plan;
  const can_execute = plan === "scale" || profile.task_count < profile.task_limit;

  return {
    used: profile.task_count,
    limit: profile.task_limit,
    plan,
    can_execute,
  };
}

export async function upgradePlanAction(
  plan: "pro" | "scale"
): Promise<{ success: boolean } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const taskLimits = { pro: 2000, scale: 999999 };

  const { error } = await supabase
    .from("profiles")
    .update({
      plan,
      task_limit: taskLimits[plan],
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: "Plan güncellenemedi." };

  revalidatePath("/billing");
  return { success: true };
}
