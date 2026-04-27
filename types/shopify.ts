export interface ShopifyOrderPayload {
  id: number;
  email: string;
  total_price: string;
  subtotal_price: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string | null;
  customer?: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    orders_count: number;
    total_spent: string;
  };
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
    product_id: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface ShopifyCheckoutPayload {
  id: number;
  token: string;
  email: string | null;
  total_price: string;
  line_items: Array<{
    title: string;
    quantity: number;
    price: string;
    product_id: number;
  }>;
  abandoned_checkout_url: string;
  created_at: string;
  updated_at: string;
}

export interface ShopifyWebhookHeaders {
  "x-shopify-topic": string;
  "x-shopify-shop-domain": string;
  "x-shopify-hmac-sha256": string;
  "x-shopify-api-version": string;
}

export interface ShopifyOAuthTokenResponse {
  access_token: string;
  scope: string;
}
