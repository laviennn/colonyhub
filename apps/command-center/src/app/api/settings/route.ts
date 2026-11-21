import { NextResponse } from 'next/server';
import {
  createAuthor,
  hasMenuPermission,
  listAuthors,
  listCategories,
  listRoles,
  listUsers,
} from '@colonyhub/db';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!hasMenuPermission(user, 'settings', 'view')) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: missing settings:view permission.' },
      { status: 403 },
    );
  }

  const [authors, categories, users, roles] = await Promise.all([
    listAuthors(),
    listCategories(),
    listUsers(),
    listRoles(),
  ]);

  return NextResponse.json({ ok: true, authors, categories, users, roles });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!hasMenuPermission(user, 'settings', 'create')) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: missing settings:create permission.' },
      { status: 403 },
    );
  }

  let body: { displayName?: unknown; role?: unknown; consentApproved?: unknown };
  try {
    body = (await request.json()) as {
      displayName?: unknown;
      role?: unknown;
      consentApproved?: unknown;
    };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : '';
  const role = typeof body.role === 'string' ? body.role.trim() : undefined;

  if (!displayName) {
    return NextResponse.json({ ok: false, error: 'Display name is required.' }, { status: 400 });
  }

  const author = await createAuthor({
    displayName,
    role,
    consentApproved: Boolean(body.consentApproved),
  });
  return NextResponse.json({ ok: true, author }, { status: 201 });
}
