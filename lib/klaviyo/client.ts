const KLAVIYO_BASE_URL = "https://a.klaviyo.com/api";

async function klaviyoRequest<T>(
  apiKey: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${KLAVIYO_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      "Content-Type": "application/json",
      revision: "2024-02-15",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Klaviyo API error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export async function verifyKlaviyoApiKey(apiKey: string): Promise<boolean> {
  try {
    await klaviyoRequest(apiKey, "/accounts/", { method: "GET" });
    return true;
  } catch {
    return false;
  }
}

export async function sendEmail(
  apiKey: string,
  to: string,
  subject: string,
  body: string
): Promise<void> {
  await klaviyoRequest(apiKey, "/events/", {
    method: "POST",
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          properties: { subject, body },
          metric: { data: { type: "metric", attributes: { name: "CartLogic Email" } } },
          profile: { data: { type: "profile", attributes: { email: to } } },
        },
      },
    }),
  });
}

export async function addToList(
  apiKey: string,
  listId: string,
  email: string,
  properties: Record<string, string> = {}
): Promise<void> {
  await klaviyoRequest(apiKey, `/lists/${listId}/relationships/profiles/`, {
    method: "POST",
    body: JSON.stringify({
      data: [
        {
          type: "profile",
          attributes: { email, ...properties },
        },
      ],
    }),
  });
}
