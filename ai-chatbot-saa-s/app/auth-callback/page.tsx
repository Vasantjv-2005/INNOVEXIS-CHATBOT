'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userStr));
        loginWithToken(token, decodedUser);
        toast.success('Successfully connected with Google!');
        router.push('/chat');
      } catch (err) {
        console.error('Failed to parse user profile', err);
        setErrorMsg('Authentication payload error. Redirecting...');
        toast.error('Authentication failed');
        setTimeout(() => router.push('/login'), 3000);
      }
    } else {
      const errorParam = searchParams.get('error');
      setErrorMsg(errorParam ? 'Google sign-in was declined.' : 'Authentication callback missing parameters.');
      toast.error('Google Auth Failed');
      setTimeout(() => router.push('/login'), 3000);
    }
  }, [searchParams, loginWithToken, router]);

  return (
    <div className="text-center relative z-10 glass-card-premium p-10 rounded-[2.5rem] bg-black/40 border border-white/5 shadow-glow max-w-sm w-full mx-4">
      {errorMsg ? (
        <>
          <h2 className="text-xl font-bold text-red-400 mb-2">Auth Error</h2>
          <p className="text-muted-foreground text-sm">{errorMsg}</p>
        </>
      ) : (
        <>
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-white mb-2">Initializing Session</h2>
          <p className="text-muted-foreground text-sm">Connecting your Google nodes...</p>
        </>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-nebula text-foreground flex items-center justify-center relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="text-center relative z-10 glass-card-premium p-10 rounded-[2.5rem] bg-black/40 border border-white/5 shadow-glow max-w-sm w-full mx-4">
          <Loader2 className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-extrabold text-white mb-2">Connecting...</h2>
        </div>
      }>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
