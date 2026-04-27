import { validateShopDomain } from "./oauth";

export async function shopifyRequest<T>(
  shop: string,
  accessToken: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!validateShopDomain(shop)) {
    throw new Error("Invalid Shopify shop domain");
  }
  const response = await fetch(
    `https://${shop}/admin/api/2024-01/${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
        ...options.headers,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function registerWebhook(
  shop: string,
  accessToken: string,
  topic: string,
  callbackUrl: string
): Promise<string> {
  const data = await shopifyRequest<{ webhook: { id: number } }>(
    shop,
    accessToken,
    "webhooks.json",
    {
      method: "POST",
      body: JSON.stringify({
        webhook: {
          topic,
          address: callbackUrl,
          format: "json",
        },
      }),
    }
  );
  return String(data.webhook.id);
}

export async function deleteWebhook(
  shop: string,
  accessToken: string,
  webhookId: string
): Promise<void> {
  await shopifyRequest(shop, accessToken, `webhooks/${webhookId}.json`, {
    method: "DELETE",
  });
}
