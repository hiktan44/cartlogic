"use client";

import { useState } from "react";
import { CheckCircle, Link2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Integration } from "@/types/database";

interface ShopifyConnectCardProps {
  integration: Integration | null;
  onDisconnect?: () => void;
}

export function ShopifyConnectCard({ integration, onDisconnect }: ShopifyConnectCardProps) {
  const [shopDomain, setShopDomain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    if (!shopDomain.trim()) {
      setError("Mağaza adresini girin.");
      return;
    }

    const domain = shopDomain.trim().replace(/^https?:\/\//, "");
    if (!domain.endsWith(".myshopify.com") && !domain.includes(".")) {
      setError("Geçerli bir Shopify mağaza adresi girin. Örn: mystore.myshopify.com");
      return;
    }

    setError("");
    setLoading(true);
    window.location.href = `/api/shopify/oauth?shop=${encodeURIComponent(domain)}`;
  }

  if (integration?.is_active) {
    return (
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/50">
            <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">
              Shopify Bağlandı
            </h4>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
              {integration.shop_domain}
            </p>
            {integration.last_synced_at && (
              <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-500">
                Son senkronizasyon: {new Date(integration.last_synced_at).toLocaleString("tr-TR")}
              </p>
            )}
          </div>
          {onDisconnect && (
            <Button variant="outline" size="sm" onClick={onDisconnect}>
              Bağlantıyı Kes
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700">
          <Link2 className="h-6 w-6 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">Shopify&apos;a Bağlan</h4>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Mağaza verilerinize erişmek için Shopify hesabınızı bağlayın.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          label="Shopify Mağaza Adresi"
          type="text"
          value={shopDomain}
          onChange={(e) => { setShopDomain(e.target.value); setError(""); }}
          placeholder="mystore.myshopify.com"
          error={error}
          hint="Shopify mağaza alan adınızı girin"
        />

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400" role="alert">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <Button onClick={handleConnect} loading={loading} className="w-full">
          Shopify ile Bağlan
        </Button>
      </div>
    </div>
  );
}
