import { NextResponse } from 'next/server';
import { deleteRole, updateRole, type MenuPermissionFlags } from '@colonyhub/db';
import { getCurrentUser } from '@/lib/session';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  let body: { name?: unknown; description?: unknown; permissions?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const { id } = await params;
  try {
    const updated = await updateRole(id, {
      name: typeof body.name === 'string' ? body.name : undefined,
      description:
        body.description === null
          ? null
          : typeof body.description === 'string'
            ? body.description
            : undefined,
      permissions:
        body.permissions && typeof body.permissions === 'object'
          ? (body.permissions as Partial<Record<string, Partial<MenuPermissionFlags>>>)
          : undefined,
    });
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'Role not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, role: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update role.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  try {
    const deleted = await deleteRole(id);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Role not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete role.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
