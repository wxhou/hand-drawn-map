import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const delta = body.unlike ? -1 : 1;
  const prompt = await db.prompt.update({
    where: { id },
    data: { likeCount: { increment: delta } },
  });
  return NextResponse.json({ likeCount: Math.max(0, prompt.likeCount) });
}
