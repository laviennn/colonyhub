import { NextResponse } from 'next/server';
import {
  getTrackingSettings,
  hasMenuPermission,
  saveTrackingSettings,
} from '@colonyhub/db';
import { revalidatePublicWeb } from '@/lib/revalidate-web';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!hasMenuPermission(user, 'tracking', 'view')) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: missing tracking:view permission.' },
      { status: 403 },
    );
  }

  const tracking = await getTrackingSettings();
  return NextResponse.json({ ok: true, tracking });
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  if (!hasMenuPermission(user, 'tracking', 'edit')) {
    return NextResponse.json(
      { ok: false, error: 'Forbidden: missing tracking:edit permission.' },
      { status: 403 },
    );
  }

  let body: {
    enabled?: unknown;
    ga4MeasurementId?: unknown;
    gtmContainerId?: unknown;
    metaPixelId?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  try {
    const tracking = await saveTrackingSettings(
      {
        enabled: typeof body.enabled === 'boolean' ? body.enabled : true,
        ga4MeasurementId: typeof body.ga4MeasurementId === 'string' ? body.ga4MeasurementId : '',
        gtmContainerId: typeof body.gtmContainerId === 'string' ? body.gtmContainerId : '',
        metaPixelId: typeof body.metaPixelId === 'string' ? body.metaPixelId : '',
      },
      user.email,
    );

    await revalidatePublicWeb(['/', '/id', '/contact', '/id/contact'], { layout: true });

    return NextResponse.json({ ok: true, tracking });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save tracking settings.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
