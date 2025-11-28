// src/hooks/useEnsureUserSync.ts
// Lightweight hook to ensure user is synced to database on first login
// Uses sessionStorage to prevent multiple sync calls per session

'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

export function useEnsureUserSync() {
  const { user, isLoaded } = useUser();
  const syncedRef = useRef(false);
  const syncingRef = useRef(false);

  useEffect(() => {
    // Only sync once when user is loaded and authenticated
    if (!isLoaded || !user || syncedRef.current || syncingRef.current) {
      return;
    }

    // Check if already synced in this session
    const sessionKey = `user-synced-${user.id}`;
    if (typeof window !== 'undefined' && sessionStorage.getItem(sessionKey)) {
      syncedRef.current = true;
      return;
    }

    const syncUser = async () => {
      syncingRef.current = true;
      
      try {
        const response = await fetch('/api/user/ensure-sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          syncedRef.current = true;
          // Mark as synced in session storage
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(sessionKey, 'true');
          }
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to sync user:', errorText);
        }
      } catch (error) {
        console.error('❌ Error syncing user:', error);
      } finally {
        syncingRef.current = false;
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return { user, isLoaded };
}
