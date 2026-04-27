import crypto from "crypto";
import type { ShopifyOAuthTokenResponse } from "@/types/shopify";

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY!;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

const SCOPES = "read_orders,read_customers,read_products,write_products,read_inventory";

const SHOPIFY_DOMAIN_REGEX = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i;

export function validateShopDomain(shop: string): boolean {
  return SHOPIFY_DOMAIN_REGEX.test(shop);
}

export function buildOAuthUrl(shop: string, state: string): string {
  if (!validateShopDomain(shop)) {
    throw new Error("Invalid Shopify shop domain");
  }
  const redirectUri = `${APP_URL}/api/shopify/callback`;
  const params = new URLSearchParams({
    client_id: SHOPIFY_API_KEY,
    scope: SCOPES,
    redirect_uri: redirectUri,
    state,
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

export async function exchangeToken(
  shop: string,
  code: string
): Promise<ShopifyOAuthTokenResponse> {
  if (!validateShopDomain(shop)) {
    throw new Error("Invalid Shopify shop domain");
  }
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return response.json() as Promise<ShopifyOAuthTokenResponse>;
}

export function verifyHmac(
  query: Record<string, string>,
  secret: string = SHOPIFY_API_SECRET
): boolean {
  const { hmac, ...rest } = query;
  if (!hmac) return false;

  const message = Object.keys(rest)
    .sort()
    .map((k) => `${k}=${rest[k]}`)
    .join("&");

  const computed = crypto
    .createHmac("sha256", secret)
    .update(message)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hmac));
}

export function verifyWebhookHmac(body: string, hmac: string): boolean {
  try {
    const computed = crypto
      .createHmac("sha256", SHOPIFY_API_SECRET)
      .update(body, "utf8")
      .digest("base64");

    const computedBuf = Buffer.from(computed);
    const hmacBuf = Buffer.from(hmac);

    if (computedBuf.length !== hmacBuf.length) return false;

    return crypto.timingSafeEqual(computedBuf, hmacBuf);
  } catch {
    return false;
  }
}

export function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}
