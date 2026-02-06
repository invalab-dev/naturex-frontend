export const API_BASE = process.env.NEXT_PUBLIC_NATUREX_BACKEND;

if (!API_BASE) {
  // In Next.js this will run on client; keep error explicit.
  console.warn('NEXT_PUBLIC_NATUREX_BACKEND is not set');
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const url = new URL(path, API_BASE);
  const headers = new Headers(init?.headers);

  let body = init?.body;
  if (init && 'json' in init) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(init.json);
  }

  const res = await fetch(url, {
    ...init,
    headers,
    body,
    credentials: 'include',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  // 204
  if (res.status === 204) return null as T;

  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    return (await res.json()) as T;
  }
  return (await res.text()) as unknown as T;
}
