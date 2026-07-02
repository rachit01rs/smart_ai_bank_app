'use client';

import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { clearSession } from '../lib/api';

export default function Header({ user }) {
  const router = useRouter();

  function logout() {
    clearSession();
    router.push('/login');
  }

  return (
    <header className="header">
      <div className="brand">
        <Logo />
        <div>
          Smart AI Bank
          <span className="tagline">Banking, made intelligent</span>
        </div>
      </div>
      {user && (
        <div className="user-info">
          <span>{user.full_name}</span>
          <span className={`role-badge ${user.role}`}>{user.role}</span>
          <button className="btn btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
