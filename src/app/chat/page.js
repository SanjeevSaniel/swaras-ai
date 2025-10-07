'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SwarasAI from '@/components/swaras-ai';
import { Loader2 } from 'lucide-react';

export default function ChatPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isSignedIn, isLoaded, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='w-8 h-8 animate-spin text-indigo-600' />
          <p className='text-slate-600 dark:text-slate-400'>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return null;
  }

  // Show the main app
  return <SwarasAI />;
}
