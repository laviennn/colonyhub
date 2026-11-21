import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const { searchParams } = new URL(request.url);
  const nextPath = searchParams.get('redirect');
  const safePath = nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/insights';
  redirect(safePath);
}
