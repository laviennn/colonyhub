import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { localePath } from '@colonyhub/content';
import { verifyPreviewToken } from '@colonyhub/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'Missing preview token.' },
      { status: 401, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    );
  }

  const payload = verifyPreviewToken(token);
  if (!payload) {
    return NextResponse.json(
      { ok: false, error: 'Invalid or expired preview token.' },
      { status: 401, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    );
  }

  const draft = await draftMode();
  draft.enable();

  redirect(localePath(payload.locale, `/insights/${payload.slug}`));
}
