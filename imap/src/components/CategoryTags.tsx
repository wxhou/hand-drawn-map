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
  Building2,
} from 'lucide-react';

const CATEGORIES = [
  { name: '全部', icon: LayoutGrid, hue: '0' },
  { name: '个人资料 / 头像', icon: User, hue: '330' },
  { name: '社交媒体帖子', icon: Share2, hue: '260' },
  { name: '信息图 / 教育视觉图', icon: BarChart3, hue: '200' },
  { name: 'YouTube 缩略图', icon: Youtube, hue: '0' },
  { name: '漫画 / 故事板', icon: BookOpen, hue: '280' },
  { name: '海报 / 传单', icon: FileText, hue: '30' },
  { name: 'APP / 网页设计', icon: Monitor, hue: '170' },
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            style={{
              backgroundColor: isActive
                ? 'var(--accent-gradient)'
                : `hsla(${cat.hue}, 40%, 15%, 0.6)`,
              color: isActive ? 'white' : 'var(--text-secondary)',
              border: isActive ? 'none' : `1px solid hsla(${cat.hue}, 30%, 40%, 0.2)`,
              backdropFilter: isActive ? 'none' : 'blur(8px)',
            }}
          >
            <Icon
              className="shrink-0"
              style={{ width: 14, height: 14 }}
            />
            <span>{cat.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
