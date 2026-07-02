'use client';

// Landing route: send the visitor to the right place for their session.
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session) router.replace('/login');
    else if (session.user.role === 'manager') router.replace('/manager');
    else router.replace('/dashboard');
  }, [router]);

  return <div className="loading">Loading Smart AI Bank…</div>;
}
