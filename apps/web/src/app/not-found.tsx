import Link from 'next/link';
import { DICTIONARIES } from '@colonyhub/content';

export default function RootNotFound() {
  const en = DICTIONARIES.en.notFound;
  const id = DICTIONARIES.id.notFound;

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#F6F4EE', color: '#0B1230', fontFamily: 'system-ui, sans-serif' }}>
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '96px 24px' }}>
          <p style={{ fontFamily: 'monospace', color: '#C2401F', letterSpacing: '0.08em' }}>404</p>
          <h1>{en.title}</h1>
          <p>{en.body}</p>
          <p lang="id">{id.body}</p>
          <p style={{ marginTop: 24 }}>
            <Link href="/" style={{ color: '#3F4BB8', fontWeight: 600 }}>
              {en.home}
            </Link>
            {' · '}
            <Link href="/id" lang="id" style={{ color: '#3F4BB8', fontWeight: 600 }}>
              {id.home}
            </Link>
          </p>
        </main>
      </body>
    </html>
  );
}
