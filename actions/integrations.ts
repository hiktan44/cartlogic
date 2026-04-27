"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { verifyKlaviyoApiKey } from "@/lib/klaviyo/client";

export async function connectKlaviyoAction(
  apiKey: string
): Promise<{ success: boolean } | { error: string }> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { error: "Geçerli bir Klaviyo API anahtarı girin." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const isValid = await verifyKlaviyoApiKey(apiKey.trim());
  if (!isValid) {
    return { error: "Klaviyo API anahtarı doğrulanamadı. Anahtarı kontrol edin." };
  }

  const { error } = await supabase.from("integrations").upsert(
    {
      user_id: user.id,
      platform: "klaviyo",
      access_token: apiKey.trim(),
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,platform" }
  );

  if (error) return { error: "Klaviyo bağlantısı kaydedilemedi." };

  revalidatePath("/integrations");
  return { success: true };
}

export async function disconnectIntegrationAction(
  platform: "shopify" | "klaviyo"
): Promise<{ success: boolean } | { error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum açmanız gerekiyor." };

  const { error } = await supabase
    .from("integrations")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("platform", platform);

  if (error) return { error: "Bağlantı kesilemedi." };

  revalidatePath("/integrations");
  return { success: true };
}
