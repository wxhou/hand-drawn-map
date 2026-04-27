import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prompt = await db.prompt.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
  });
  return NextResponse.json({ likeCount: prompt.likeCount });
}
