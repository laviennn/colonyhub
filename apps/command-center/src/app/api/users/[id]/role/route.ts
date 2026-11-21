import { NextResponse } from 'next/server';
import { assignUserRole } from '@colonyhub/db';
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

  let body: { roleId?: unknown };
  try {
    body = (await request.json()) as { roleId?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  const roleId = typeof body.roleId === 'string' ? body.roleId.trim() : '';
  if (!roleId) {
    return NextResponse.json({ ok: false, error: 'roleId is required.' }, { status: 400 });
  }

  const { id } = await params;
  try {
    const updated = await assignUserRole(id, roleId);
    if (!updated) {
      return NextResponse.json({ ok: false, error: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, user: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to assign role.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
