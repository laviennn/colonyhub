import Link from 'next/link';
import { getDictionary } from '@colonyhub/content';

export default function IdNotFound() {
  const dict = getDictionary('id');
  return (
    <main id="main" className="wrap not-found-section">
      <div className="not-found-inner">
        <p className="col-label col-label--dark">404</p>
        <h1>{dict.notFound.title}</h1>
        <p>{dict.notFound.body}</p>
        <Link className="btn btn--lime" href="/id">
          {dict.notFound.home}
        </Link>
      </div>
    </main>
  );
}
