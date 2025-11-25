'use client';

import SwarasAI from '@/components/swaras-ai';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='w-8 h-8 animate-spin text-purple-400' />
          <p className='text-purple-300'>Loading...</p>
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
