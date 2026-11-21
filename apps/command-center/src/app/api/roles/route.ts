import { NextResponse } from 'next/server';
import {
  ADMIN_MENUS,
  createRole,
  listRoles,
  type MenuPermissionFlags,
} from '@colonyhub/db';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!user.isSuperAdmin) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: Super Admin access required.' },
      { status: 403 },
    );
  }

  const roles = await listRoles();
  return NextResponse.json({ ok: true, menus: ADMIN_MENUS, roles });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!user.isSuperAdmin) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: Super Admin access required.' },
      { status: 403 },
    );
  }

  let body: {
    name?: unknown;
    slug?: unknown;
    description?: unknown;
    permissions?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) {
    return NextResponse.json({ ok: false, error: 'Role name is required.' }, { status: 400 });
  }

  try {
    const role = await createRole({
      name,
      slug: typeof body.slug === 'string' ? body.slug : undefined,
      description: typeof body.description === 'string' ? body.description : null,
      permissions:
        body.permissions && typeof body.permissions === 'object'
          ? (body.permissions as Partial<Record<string, Partial<MenuPermissionFlags>>>)
          : undefined,
    });
    return NextResponse.json({ ok: true, role }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create role.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
