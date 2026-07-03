'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../../components/Logo';
import { api, saveSession } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // When the account has OTP enabled, login becomes a two-step form:
  // credentials first, then the OTP code.
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const session = await api('login', {
        method: 'POST',
        body: JSON.stringify(
          otpRequired ? { username, password, otp } : { username, password }
        ),
      });
      if (session.otpRequired) {
        setOtpRequired(true);
        setBusy(false);
        return;
      }
      saveSession(session);
      router.push(session.user.role === 'manager' ? '/manager' : '/dashboard');
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  function backToCredentials() {
    setOtpRequired(false);
    setOtp('');
    setError('');
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand-block">
          <Logo />
          <h1>Smart AI Bank</h1>
          <p className="subtitle">
            {otpRequired
              ? 'Enter the OTP code to finish signing in'
              : 'Sign in to your online banking'}
          </p>
        </div>

        {error && <div className="error-box">{error}</div>}

        {otpRequired ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="otp">OTP code</label>
            <input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              required
            />
            <button className="btn" style={{ width: '100%' }} disabled={busy}>
              {busy ? 'Verifying…' : 'Verify'}
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={backToCredentials}
            >
              ← Back to sign in
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button className="btn" style={{ width: '100%' }} disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        <div className="demo-creds">
          <strong>Demo accounts</strong>
          <br />
          Customer: <code>ram</code> / <code>customer123</code>
          <br />
          Manager: <code>manager</code> / <code>manager123</code>
          <br />
          OTP code (if enabled): <code>123456</code>
        </div>
      </div>
    </div>
  );
}
