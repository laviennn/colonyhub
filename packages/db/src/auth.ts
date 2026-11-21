import crypto from 'node:crypto';

export type UserRole = 'admin' | 'editor' | 'reviewer';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export function generateSessionToken(): { raw: string; hash: string } {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = hashToken(raw);
  return { raw, hash };
}

export function hashToken(raw: string): string {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// Legacy static-role helpers preserved for unit test compatibility
export function canPublish(role: UserRole): boolean {
  return role === 'admin' || role === 'reviewer';
}

export function canManageInquiries(role: UserRole): boolean {
  return role === 'admin' || role === 'reviewer';
}

export function canManageSettings(role: UserRole): boolean {
  return role === 'admin';
}

/**
 * Signed time-limited preview token shared between apps/command-center and apps/web.
 */
export function signPreviewToken(input: {
  locale: 'en' | 'id';
  slug: string;
  ttlSeconds?: number;
  secret?: string;
}): string {
  const secret = input.secret ?? process.env.PREVIEW_SECRET ?? 'dev-preview-secret-change-in-prod';
  const exp = Math.floor(Date.now() / 1000) + (input.ttlSeconds ?? 900);
  const payload = Buffer.from(
    JSON.stringify({ locale: input.locale, slug: input.slug, exp }),
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyPreviewToken(
  token: string,
  secret?: string,
): { locale: 'en' | 'id'; slug: string; exp: number } | null {
  const resolvedSecret =
    secret ?? process.env.PREVIEW_SECRET ?? 'dev-preview-secret-change-in-prod';
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', resolvedSecret).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      locale?: string;
      slug?: string;
      exp?: number;
    };
    if (
      (parsed.locale !== 'en' && parsed.locale !== 'id') ||
      typeof parsed.slug !== 'string' ||
      typeof parsed.exp !== 'number'
    ) {
      return null;
    }
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return { locale: parsed.locale, slug: parsed.slug, exp: parsed.exp };
  } catch {
    return null;
  }
}
