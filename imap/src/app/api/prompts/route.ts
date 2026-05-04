import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { findCategoryForSearch } from '@/lib/search-synonyms';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      const words = search.trim().split(/\s+/);

      // Collect categories that match search terms
      const matchedCategories: string[] = [];
      for (const word of words) {
        const cat = findCategoryForSearch(word);
        if (cat) matchedCategories.push(cat);
      }
      const uniqueCategories = [...new Set(matchedCategories)];

      if (uniqueCategories.length > 0 && !category) {
        // Search term maps to a category — use category filter (indexed, fast)
        // PLUS text search across all categories for non-category matches
        where.OR = [
          ...uniqueCategories.map(c => ({ category: c })),
          ...words.flatMap(word => [
            { title: { contains: word } },
            { description: { contains: word } },
            { promptText: { contains: word } },
          ]),
        ];
      } else {
        // No category match — simple text search
        where.OR = words.flatMap(word => [
          { title: { contains: word } },
          { description: { contains: word } },
          { promptText: { contains: word } },
        ]);
      }
    } else if (category && category !== '全部') {
      where.category = category;
    }

    const random = searchParams.get('random') === '1';

    if (random) {
      const total = await db.prompt.count({ where });
      if (total === 0) return NextResponse.json({ prompts: [], total: 0 });
      const offset = Math.floor(Math.random() * total);
      const prompts = await db.prompt.findMany({ where, skip: offset, take: 1 });
      return NextResponse.json({ prompts, total, page: 1, limit: 1 });
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
  } catch (error) {
    console.error('GET /api/prompts error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
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