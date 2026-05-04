import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { db } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    include: { prompt: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ favorites });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 });
  }

  const { promptId } = await request.json();
  if (!promptId) {
    return NextResponse.json({ error: '缺少 promptId' }, { status: 400 });
  }

  const existing = await db.favorite.findUnique({
    where: { userId_promptId: { userId: session.user.id, promptId } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await db.favorite.create({
    data: { userId: session.user.id, promptId },
  });
  return NextResponse.json({ favorited: true });
}