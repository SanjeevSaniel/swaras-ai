import { db } from '@/db';
import { anonymousUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  // Get user's current usage
  const user = await db.query.anonymousUsers.findFirst({
    where: eq(anonymousUsers.ipAddress, ip),
  });

  const interactionCount = user?.interactionCount || 0;
  const limit = 3;
  const remaining = Math.max(0, limit - interactionCount);
  const isLimitReached = interactionCount >= limit;

  return NextResponse.json({
    interactionCount,
    limit,
    remaining,
    isLimitReached,
  });
}
