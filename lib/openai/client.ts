import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export async function analyzeSentiment(text: string): Promise<{
  sentiment: "positive" | "negative" | "neutral";
  topic: string;
  summary: string;
}> {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a sentiment analysis expert for e-commerce. Analyze the given review and return JSON with: sentiment (positive/negative/neutral), topic (Shipping/Product Quality/Customer Service/Pricing/Other), and a brief summary in Turkish.",
      },
      { role: "user", content: text },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  const result = JSON.parse(response.choices[0].message.content ?? "{}") as {
    sentiment: "positive" | "negative" | "neutral";
    topic: string;
    summary: string;
  };
  return result;
}

export async function generateEmailCopy(context: {
  customerName: string;
  cartItems: string[];
  totalValue: string;
}): Promise<string> {
  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an expert e-commerce copywriter. Write personalized, engaging cart recovery emails in Turkish. Keep it friendly, warm, and conversion-focused. Return only the email body text.",
      },
      {
        role: "user",
        content: `Customer: ${context.customerName}\nAbandoned cart: ${context.cartItems.join(", ")}\nCart value: ${context.totalValue}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  return response.choices[0].message.content ?? "";
}

export async function analyzeLTV(orderHistory: {
  orderCount: number;
  totalSpent: string;
  lastOrderDate: string;
}): Promise<{ isVip: boolean; segment: string; message: string }> {
  const total = parseFloat(orderHistory.totalSpent);
  const isVip = total > 500 || orderHistory.orderCount >= 5;
  const segment = isVip ? "VIP" : total > 200 ? "Loyal" : "New";
  const message = isVip
    ? "Değerli müşterimiz, özel VIP avantajlarınızı keşfedin!"
    : "Alışverişiniz için teşekkürler!";

  return { isVip, segment, message };
}
