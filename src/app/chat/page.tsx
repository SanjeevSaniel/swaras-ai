'use client';

import SwarasAI from '@/components/swaras-ai';
import PageLoader from '@/components/ui/page-loader';
import { useUser } from '@clerk/nextjs';
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
    return <PageLoader />;
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return null;
  }

  // Show the main app
  return <SwarasAI />;
}
