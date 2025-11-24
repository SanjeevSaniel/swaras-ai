'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LightLandingPage from '@/components/landing/light-landing-page';
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
      <div className='min-h-screen flex items-center justify-center bg-white'>
        <div className='flex flex-col items-center gap-4'>
          <div className='relative'>
            <Loader2 className='w-8 h-8 text-gray-400 animate-spin' />
          </div>
          <p className='text-gray-600 text-sm font-light animate-pulse'>Loading Swaras AI...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!isSignedIn) {
    return <LightLandingPage />;
  }

  // This shouldn't render due to the useEffect redirect, but just in case
  return null;
}
