import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { deleteSession, getSessionUser, type UserRecord } from '@colonyhub/db';

export const SESSION_COOKIE_NAME = 'colonyhub_cc_session';

export async function getCurrentUser(): Promise<UserRecord | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return getSessionUser(token);
}

export async function requireUser(): Promise<UserRecord> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function setSessionCookie(rawToken: string, ttlDays = 7): Promise<void> {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await deleteSession(token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return request.headers.get('x-real-ip')?.trim() || '127.0.0.1';
}
