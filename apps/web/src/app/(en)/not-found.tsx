import Link from 'next/link';
import { getDictionary } from '@colonyhub/content';

export default function EnNotFound() {
  const dict = getDictionary('en');
  return (
    <main id="main" className="wrap not-found-section">
      <div className="not-found-inner">
        <p className="col-label col-label--dark">404</p>
        <h1>{dict.notFound.title}</h1>
        <p>{dict.notFound.body}</p>
        <Link className="btn btn--lime" href="/">
          {dict.notFound.home}
        </Link>
      </div>
    </main>
  );
}
