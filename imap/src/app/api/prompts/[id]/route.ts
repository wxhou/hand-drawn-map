import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const prompt = await db.prompt.findUnique({ where: { id } });
  if (!prompt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await db.prompt.update({ where: { id }, data: { viewCount: { increment: 1 } } });

  return NextResponse.json(prompt);
}
