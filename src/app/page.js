'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedLandingPage from '@/components/landing/enhanced-landing-page';
import { Loader2, Sparkles } from 'lucide-react';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/chat');
    }
  }, [isSignedIn, isLoaded, router]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-950'>
        <div className='flex flex-col items-center gap-4'>
          <div className='relative'>
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse'>
              <Sparkles className='w-8 h-8 text-white' />
            </div>
            <div className='absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 blur-xl opacity-50 animate-pulse' />
          </div>
          <p className='text-slate-400 animate-pulse'>Loading Swaras AI...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!isSignedIn) {
    return <EnhancedLandingPage />;
  }

  // This shouldn't render due to the useEffect redirect, but just in case
  return null;
}
