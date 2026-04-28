'use client';

import { motion } from 'framer-motion';
import {
  LayoutGrid,
  User,
  Share2,
  BarChart3,
  Youtube,
  BookOpen,
  FileText,
  Monitor,
  Package,
  Shirt,
  Building,
} from 'lucide-react';

const CATEGORIES = [
  { name: '全部', icon: LayoutGrid },
  { name: '个人资料 / 头像', icon: User },
  { name: '社交媒体帖子', icon: Share2 },
  { name: '信息图 / 教育视觉图', icon: BarChart3 },
  { name: 'YouTube 缩略图', icon: Youtube },
  { name: '漫画 / 故事板', icon: BookOpen },
  { name: '海报 / 传单', icon: FileText },
  { name: '产品展示', icon: Package },
  { name: 'APP / 网页设计', icon: Monitor },
  { name: '时尚 / 服装', icon: Shirt },
  { name: '建筑 / 室内设计', icon: Building },
];

interface CategoryTagsProps {
  activeCategory: string;
  onSelect: (category: string) => void;
  showAll?: boolean;
}

export function CategoryTags({ activeCategory, onSelect, showAll = true }: CategoryTagsProps) {
  const cats = showAll
    ? CATEGORIES
    : CATEGORIES.filter((c) => c.name !== '全部');

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {cats.map((cat, index) => {
        const isActive = activeCategory === cat.name;
        const Icon = cat.icon;
        return (
          <motion.button
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.04, duration: 0.5 }}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors"
            style={{
              fontFamily: isActive ? 'var(--font-serif)' : 'var(--font-sans)',
              fontWeight: isActive ? 600 : 400,
              backgroundColor: isActive ? 'var(--accent-muted)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              border: isActive ? '1px solid var(--accent-border)' : '1px solid var(--border)',
              letterSpacing: '0.02em',
            }}
          >
            <Icon style={{ width: 14, height: 14 }} />
            <span>{cat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}