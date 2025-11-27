'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { isLoaded, signIn } = useSignIn();
  const [error, setError] = useState('');
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);

  const handleOAuthSignIn = async (
    strategy: 'oauth_google' | 'oauth_github',
  ) => {
    if (!isLoaded) return;
    setLoadingStrategy(strategy);
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/chat',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Failed to sign in');
      setLoadingStrategy(null);
    }
  };

  return (
    <div
      className={cn('flex flex-col gap-6', className)}
      {...props}>
      <Card className='border-gray-200 shadow-lg bg-white'>
        <CardHeader className='text-center pb-2'>
          <Link href='/'>
            <div className='flex justify-center mb-4'>
              <div className='flex items-center gap-2.5'>
                <div
                  className='relative w-10 h-10 rounded-xl overflow-hidden shadow-md'
                  style={{
                    background: 'linear-gradient(135deg, #FA8072, #FF8E8E)',
                  }}>
                  <svg
                    className='w-10 h-10 p-1.5'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M12 3C10 3 8 4 7 5.5C6 5 5 5.5 5 7C4 7.5 3.5 8.5 3.5 9.5C3.5 11 4.5 12 6 12C6 14 7 15.5 8.5 16.5'
                      stroke='white'
                      strokeWidth='1.8'
                      strokeLinecap='round'
                      opacity='0.95'
                    />
                    <path
                      d='M12 3C14 3 16 4 17 5.5C18 5 19 5.5 19 7C20 7.5 20.5 8.5 20.5 9.5C20.5 11 19.5 12 18 12C18 14 17 15.5 15.5 16.5'
                      stroke='white'
                      strokeWidth='1.8'
                      strokeLinecap='round'
                      opacity='0.95'
                    />
                    <path
                      d='M8 13H16C17.1 13 18 13.9 18 15V18C18 19.1 17.1 20 16 20H13L11 22L9 20H8C6.9 20 6 19.1 6 18V15C6 13.9 6.9 13 8 13Z'
                      stroke='white'
                      strokeWidth='1.8'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      opacity='0.95'
                    />
                    <circle
                      cx='10'
                      cy='16.5'
                      r='1'
                      fill='white'
                      opacity='0.95'
                    />
                    <circle
                      cx='12'
                      cy='16.5'
                      r='1'
                      fill='white'
                      opacity='0.95'
                    />
                    <circle
                      cx='14'
                      cy='16.5'
                      r='1'
                      fill='white'
                      opacity='0.95'
                    />
                  </svg>
                </div>
                <div className='flex items-center'>
                  <span className='text-2xl font-bold tracking-tight text-gray-900 font-[family-name:var(--font-raleway)]'>
                    Swar
                    <span className='font-extrabold text-[#FA8072]'>AI</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
          <CardTitle className='text-xl font-semibold text-gray-900'>
            Welcome back
          </CardTitle>
          <CardDescription className='text-gray-500'>
            Sign in to continue your learning journey
          </CardDescription>
        </CardHeader>
        <CardContent className='pt-6'>
          <div className='grid gap-4'>
            <Button
              size='lg'
              variant='default'
              type='button'
              onClick={() => handleOAuthSignIn('oauth_google')}
              disabled={!isLoaded || loadingStrategy !== null}
              className='h-11 border-gray-200 bg-gray-200 text-md text-gray-900 hover:bg-gray-300 hover:text-gray-900'>
              {loadingStrategy === 'oauth_google' ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <svg
                  className='mr-2 h-4 w-4'
                  aria-hidden='true'
                  focusable='false'
                  data-prefix='fab'
                  data-icon='google'
                  role='img'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 488 512'>
                  <path
                    fill='currentColor'
                    d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'></path>
                </svg>
              )}
              Continue with Google
            </Button>
            <Button
              size='lg'
              variant='default'
              type='button'
              onClick={() => handleOAuthSignIn('oauth_github')}
              disabled={!isLoaded || loadingStrategy !== null}
              className='h-11 border-gray-200 bg-gray-200 text-md text-gray-900 hover:bg-gray-300 hover:text-gray-900'>
              {loadingStrategy === 'oauth_github' ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <svg
                  className='mr-2 h-4 w-4'
                  aria-hidden='true'
                  focusable='false'
                  data-prefix='fab'
                  data-icon='github'
                  role='img'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 496 512'>
                  <path
                    fill='currentColor'
                    d='M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z'></path>
                </svg>
              )}
              Continue with GitHub
            </Button>
          </div>

          {error && (
            <p className='text-sm text-red-600 text-center mt-4 bg-red-50 p-2 rounded-md border border-red-100'>
              {error}
            </p>
          )}

          <div className='mt-6 text-center text-sm text-gray-500'>
            Don&apos;t have an account?{' '}
            <Link
              href='/signup'
              className='font-semibold text-gray-900 hover:underline'>
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
      <div className='px-6 text-center text-xs text-gray-500'>
        By continuing, you agree to our{' '}
        <Link
          href='/terms'
          className='underline hover:text-gray-900'>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href='/privacy'
          className='underline hover:text-gray-900'>
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
