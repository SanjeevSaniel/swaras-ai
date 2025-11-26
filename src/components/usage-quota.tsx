'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

const UsageQuota = ({ className = '', onUsageUpdate }) => {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const intervalRef = useRef(null);

  // Fetch usage stats - memoized with useCallback
  const fetchUsage = useCallback(async () => {
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
  }, [onUsageUpdate]);

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
  }, [fetchUsage]);

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
    <motion.div
      className={`rounded-xl border border-border/50 bg-gradient-to-br from-background via-background to-accent/5 shadow-lg backdrop-blur-sm ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Clickable Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='w-full px-4 py-3 flex items-center justify-between hover:bg-accent/30 transition-colors rounded-t-xl'
      >
        <div className='flex items-center gap-2'>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isVeryLowQuota
              ? 'bg-red-500'
              : isLowQuota
              ? 'bg-orange-500'
              : 'bg-[#FA8072]'
          }`} />
          <MessageSquare className='w-3.5 h-3.5 text-muted-foreground' />
          <span className='text-xs font-medium text-foreground'>
            Daily Quota
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-bold text-foreground'>
            {usage.remaining}/{usage.limit}
          </span>
          {isExpanded ? (
            <ChevronUp className='w-3.5 h-3.5 text-muted-foreground' />
          ) : (
            <ChevronDown className='w-3.5 h-3.5 text-muted-foreground' />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='px-4 pb-3 space-y-2.5'>
              {/* Progress bar */}
              <div className='relative'>
                <div className='w-full h-2 bg-muted/50 rounded-full overflow-hidden'>
                  <motion.div
                    className={`h-full rounded-full ${
                      isVeryLowQuota
                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                        : isLowQuota
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : 'bg-gradient-to-r from-[#FA8072] to-[#FF8E8E]'
                    }`}
                    initial={false}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                </div>
                {/* Percentage label */}
                <span className='absolute -top-5 right-0 text-[10px] font-medium text-muted-foreground'>
                  {Math.round(percentage)}%
                </span>
              </div>

              {/* Stats Row */}
              <div className='flex items-center justify-between text-[10px]'>
                <div className='flex items-center gap-3'>
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground/60 uppercase tracking-wider'>
                      Used
                    </span>
                    <span className='font-bold text-foreground'>
                      {usage.used}
                    </span>
                  </div>
                  <div className='w-px h-6 bg-border/50' />
                  <div className='flex flex-col'>
                    <span className='text-muted-foreground/60 uppercase tracking-wider'>
                      Tier
                    </span>
                    <span className='font-bold bg-gradient-to-r from-[#FA8072] to-[#FF8E8E] bg-clip-text text-transparent'>
                      {usage.tier}
                    </span>
                  </div>
                </div>

                <div className='text-right'>
                  {isVeryLowQuota ? (
                    <span className='text-red-500 font-bold'>Almost full!</span>
                  ) : isLowQuota ? (
                    <span className='text-orange-500 font-bold'>Running low</span>
                  ) : (
                    <div className='flex flex-col'>
                      <span className='text-muted-foreground/60'>Resets</span>
                      <span className='font-medium text-foreground'>
                        {formatResetTime(usage.resetAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function to format reset time
function formatResetTime(resetAt: string): string {
  const resetDate = new Date(resetAt);
  const now = new Date();
  const diffMs = resetDate.getTime() - now.getTime();
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
