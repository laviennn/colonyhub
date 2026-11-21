'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LOCAL_DEV_ACCOUNTS = [
  { role: 'admin', email: 'admin@colonyhub.local', password: 'colonyhub-admin-dev' },
  { role: 'reviewer', email: 'reviewer@colonyhub.local', password: 'colonyhub-reviewer-dev' },
  { role: 'editor', email: 'editor@colonyhub.local', password: 'colonyhub-editor-dev' },
] as const;

export function LoginForm({ showLocalHint }: { showLocalHint: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || 'Invalid email or password.');
        return;
      }
      router.push('/');
      router.refresh();
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="cc-login-form" noValidate>
      {error ? (
        <div className="cc-alert cc-alert--error" role="alert">
          {error}
        </div>
      ) : null}

      <div className="cc-field">
        <label htmlFor="cc-email">Email</label>
        <input
          id="cc-email"
          name="email"
          type="email"
          inputMode="email"
          className="cc-input"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@colonyhub.id"
          aria-invalid={Boolean(error)}
        />
      </div>

      <div className="cc-field">
        <label htmlFor="cc-password">Password</label>
        <div className="cc-password-wrap">
          <input
            id="cc-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            className="cc-input"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-invalid={Boolean(error)}
          />
          <button
            type="button"
            className="cc-password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button type="submit" className="cc-btn cc-btn--navy cc-auth-submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>

      {showLocalHint ? (
        <div className="cc-dev-bar" aria-label="Local dev quick fill">
          <span className="cc-dev-bar-label">Dev fill:</span>
          <div className="cc-dev-bar-pills">
            {LOCAL_DEV_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                type="button"
                className="cc-dev-pill"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword(acc.password);
                  setError(null);
                }}
              >
                {acc.role}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
