'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const UsageQuota = ({ className = '', onUsageUpdate }) => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  // Fetch usage stats
  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/user/usage');

      if (!response.ok) {
        throw new Error('Failed to fetch usage');
      }

      const data = await response.json();
      setUsage(data);
      if (onUsageUpdate) {
        onUsageUpdate(data);
      }
    } catch (err) {
      console.error('Error fetching usage:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchUsage();

    // Poll every 5 seconds for instant updates
    intervalRef.current = setInterval(fetchUsage, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (loading || !usage) {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
        <div className='w-3 h-3 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin' />
        <span>Loading...</span>
      </div>
    );
  }

  const percentage = usage.percentage;
  const isLowQuota = percentage >= 80;
  const isVeryLowQuota = percentage >= 95;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Compact Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1.5'>
          <MessageSquare className='w-3.5 h-3.5 text-muted-foreground' />
          <span className='text-xs font-medium text-muted-foreground'>
            Daily Quota
          </span>
        </div>
        <span className='text-xs font-semibold text-foreground'>
          {usage.remaining}/{usage.limit}
        </span>
      </div>

      {/* Compact Progress bar */}
      <div className='w-full h-1.5 bg-muted rounded-full overflow-hidden'>
        <motion.div
          className={`h-full rounded-full transition-colors ${
            isVeryLowQuota
              ? 'bg-destructive'
              : isLowQuota
              ? 'bg-orange-500'
              : 'bg-primary'
          }`}
          initial={false}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Compact status message */}
      <div className='flex items-center justify-between text-[10px] text-muted-foreground/70'>
        <span className='uppercase tracking-wider'>{usage.tier}</span>
        <span>
          {isVeryLowQuota ? (
            <span className='text-destructive font-medium'>Almost full!</span>
          ) : isLowQuota ? (
            <span className='text-orange-500 font-medium'>Running low</span>
          ) : (
            <span>Resets {formatResetTime(usage.resetAt)}</span>
          )}
        </span>
      </div>
    </div>
  );
};

// Helper function to format reset time
function formatResetTime(resetAt) {
  const resetDate = new Date(resetAt);
  const now = new Date();
  const diffMs = resetDate - now;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours > 24) {
    return `in ${Math.floor(diffHours / 24)} days`;
  } else if (diffHours > 0) {
    return `in ${diffHours}h ${diffMinutes}m`;
  } else if (diffMinutes > 0) {
    return `in ${diffMinutes} minutes`;
  } else {
    return 'soon';
  }
}

export default UsageQuota;
