import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const DEFAULT_CATEGORIES = [
  { name: '个人资料 / 头像', icon: 'ri-user-line', order: 0 },
  { name: '社交媒体帖子', icon: 'ri-share-line', order: 1 },
  { name: '信息图 / 教育视觉图', icon: 'ri-bar-chart-line', order: 2 },
  { name: 'YouTube 缩略图', icon: 'ri-youtube-line', order: 3 },
  { name: '漫画 / 故事板', icon: 'ri-artboard-line', order: 4 },
  { name: '海报 / 传单', icon: 'ri-file-paper-line', order: 5 },
  { name: 'APP / 网页设计', icon: 'ri-computer-line', order: 6 },
  { name: '产品展示', icon: 'ri-window-line', order: 7 },
  { name: '时尚 / 服装', icon: 'ri-t-shirt-line', order: 8 },
  { name: '建筑 / 室内设计', icon: 'ri-home-line', order: 9 },
];

export async function GET() {
  let categories = await db.category.findMany({ orderBy: { order: 'asc' } });
  if (categories.length === 0) {
    await db.category.createMany({ data: DEFAULT_CATEGORIES });
    categories = await db.category.findMany({ orderBy: { order: 'asc' } });
  }
  return NextResponse.json(categories);
}
