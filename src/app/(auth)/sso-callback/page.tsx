// src/app/(auth)/sso-callback/page.tsx
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallbackPage() {
  return <AuthenticateWithRedirectCallback />;
}
