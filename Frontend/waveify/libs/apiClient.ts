// src/lib/apiClient.ts
const ENV_BASE = process.env.NEXT_PUBLIC_API_URL?.trim();

function buildUrl(input: string): string {
  if (input.startsWith("http://") || input.startsWith("https://")) return input;
  if (input.startsWith("/api/")) return input; // ВАЖНО: пусть идёт через rewrite (same-site)
  if (ENV_BASE) return `${ENV_BASE.replace(/\/+$/, "")}/${input.replace(/^\/+/, "")}`;
  return input;
}

let refreshPromise: Promise<void> | null = null;

async function refreshTokensOnce() {
  if (!refreshPromise) {
    refreshPromise = fetch(buildUrl("/api/User/refresh-token"), {
      method: "POST",
      credentials: "include",
    }).then(r => {
      if (!r.ok) throw new Error("Refresh failed");
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

type ApiFetchInit = RequestInit & { retry?: boolean };

export async function apiFetch(input: string, init: ApiFetchInit = {}) {
  const url = buildUrl(input);
  const { retry = true, ...rest } = init;

  const res = await fetch(url, {
    ...rest,
    credentials: "include",
    headers: {
      // Не навязываем Content-Type для GET без body
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(rest.headers || {}),
    },
  });

  if (res.status !== 401 || !retry) return res;

  try {
    await refreshTokensOnce();
  } catch {
    return res;
  }
  return fetch(url, {
    ...rest,
    credentials: "include",
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(rest.headers || {}),
    },
  });
}
