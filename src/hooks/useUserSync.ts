// src/hooks/useUserSync.ts
// Hook to automatically sync Clerk user to Neon database
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

export function useUserSync() {
  const { user, isLoaded } = useUser();
  const syncedRef = useRef(false);

  useEffect(() => {
    console.log('🔍 useUserSync effect running:', {
      isLoaded,
      hasUser: !!user,
      userId: user?.id,
      alreadySynced: syncedRef.current,
    });

    // Only sync once when user is loaded and authenticated
    if (!isLoaded) {
      console.log('⏳ Waiting for Clerk to load...');
      return;
    }

    if (!user) {
      console.log('⚠️ No user authenticated');
      return;
    }

    if (syncedRef.current) {
      console.log('✓ User already synced in this session');
      return;
    }

    const syncUser = async () => {
      try {
        console.log('🔄 Syncing user to database:', user.id);

        const response = await fetch('/api/user/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          }),
        });

        if (response.ok) {
          console.log('✅ User synced to database');
          syncedRef.current = true;
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to sync user:', errorText);
        }
      } catch (error) {
        console.error('❌ Error syncing user:', error);
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return { user, isLoaded };
}
