import { NextResponse } from 'next/server';
import { authenticateUser, createSession, generateSessionToken } from '@colonyhub/db';
import { checkLoginRateLimit } from '@/lib/rate-limit';
import { getClientIp, setSessionCookie } from '@/lib/session';

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkLoginRateLimit(`login:${ip}`, { limit: 12, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many sign-in attempts. Please wait a minute.' },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
    );
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: 'Email and password are required.' },
      { status: 400 },
    );
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return NextResponse.json(
      { ok: false, error: 'Invalid email or password.' },
      { status: 401 },
    );
  }

  const { raw, hash } = generateSessionToken();
  await createSession(user.id, hash, 7);
  await setSessionCookie(raw, 7);

  return NextResponse.json({ ok: true, user });
}
