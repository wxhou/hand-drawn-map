import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ favorited: false });
  }

  const { searchParams } = new URL(request.url);
  const promptId = searchParams.get('promptId');
  if (!promptId) {
    return NextResponse.json({ error: '缺少 promptId' }, { status: 400 });
  }

  const existing = await db.favorite.findUnique({
    where: { userId_promptId: { userId: session.user.id, promptId } },
  });

  return NextResponse.json({ favorited: !!existing });
}