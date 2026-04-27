import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (category && category !== '全部') {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { promptText: { contains: search } },
    ];
  }

  const [prompts, total] = await Promise.all([
    db.prompt.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    db.prompt.count({ where }),
  ]);

  return NextResponse.json({ prompts, total, page, limit });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, description, category, promptText, imageUrl, authorName } = body;

  if (!title || !category || !promptText || !imageUrl) {
    return NextResponse.json({ error: '请填写所有必填项' }, { status: 400 });
  }

  const prompt = await db.prompt.create({
    data: {
      title,
      description: description || '',
      category,
      promptText,
      imageUrl,
      authorName: authorName || '匿名用户',
      source: 'user_submit',
    },
  });

  return NextResponse.json(prompt, { status: 201 });
}
