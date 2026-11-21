import { redirect } from 'next/navigation';
import { hasDatabaseUrl } from '@colonyhub/db';
import { LoginForm } from '@/components/LoginForm';
import { getCurrentUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect('/');
  }

  return (
    <main className="cc-login-page">
      <div className="cc-login-container">
        <header className="cc-login-brand">
          <svg width="28" height="28" viewBox="0 0 36 36" aria-hidden="true">
            <circle
              cx="18"
              cy="18"
              r="13.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeDasharray="66 19"
              strokeLinecap="round"
            />
            <circle cx="18" cy="18" r="4.2" fill="#C6F432" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <div>
            <h1 className="cc-login-title">Command Center</h1>
            <p className="cc-login-sub">colonyhub internal</p>
          </div>
        </header>

        <section className="cc-login-surface" aria-label="Sign in">
          <LoginForm showLocalHint={!hasDatabaseUrl()} />
        </section>

        <footer className="cc-login-foot">
          <span>colonyhub.id</span>
          <span>·</span>
          <span>restricted access</span>
        </footer>
      </div>
    </main>
  );
}
