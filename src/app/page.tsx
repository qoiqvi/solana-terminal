'use client';
import { useAuth } from '@/shared/hooks';
import Terminal from '@/widgets/terminal/terminal';
import { useEffect } from 'react';

export default function Home() {
  const { login, authenticated, ready, user, logout } = useAuth();

  useEffect(() => {
    if (ready && !authenticated) {
      login();
    }
  }, [ready, authenticated]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Terminal
        firstToken="6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN"
        secondToken="So11111111111111111111111111111111111111112"
      />
      {user && <p>{user.wallet?.address}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
