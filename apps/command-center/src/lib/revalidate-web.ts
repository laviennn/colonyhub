const DEFAULT_DEV_REVALIDATE_SECRET = 'colonyhub-dev-revalidate-secret';

export function getPublicWebUrl(): string {
  return (process.env.PUBLIC_WEB_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export async function revalidatePublicWeb(
  paths: string[],
  options?: { layout?: boolean },
): Promise<{
  ok: boolean;
  revalidated?: string[];
}> {
  const webUrl = getPublicWebUrl();
  const secret = process.env.REVALIDATION_SECRET || DEFAULT_DEV_REVALIDATE_SECRET;

  try {
    const res = await fetch(`${webUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidation-secret': secret,
      },
      body: JSON.stringify({ paths, layout: Boolean(options?.layout) }),
      cache: 'no-store',
    });
    if (!res.ok) {
      return { ok: false };
    }
    const data = (await res.json().catch(() => ({}))) as { revalidated?: string[] };
    return { ok: true, revalidated: data.revalidated };
  } catch {
    return { ok: false };
  }
}
