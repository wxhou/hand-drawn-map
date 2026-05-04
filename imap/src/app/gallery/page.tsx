'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PromptCard, SkeletonCard } from '@/components/PromptCard';
import { CategoryTags } from '@/components/CategoryTags';
import { SearchBar } from '@/components/SearchBar';
import { PromptModal } from '@/components/PromptModal';

const PAGE_SIZE = 100;

interface Prompt {
  id: string;
  title: string;
  description?: string | null;
  promptText: string;
  imageUrl: string;
  category: string;
  authorName: string;
  authorAvatar?: string | null;
  likeCount: number;
  viewCount: number;
  isFeatured: boolean;
  source: string;
  createdAt: string;
}

export default function Gallery() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchValue, setSearchValue] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const fetchPrompts = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pageNum.toString());
      params.set('limit', PAGE_SIZE.toString());
      if (activeCategory !== '全部') params.set('category', activeCategory);
      if (searchValue) params.set('search', searchValue);

      const res = await fetch(`/api/prompts?${params.toString()}`);
      const data = await res.json();
      setPrompts(data.prompts || []);
      setTotal(data.total || 0);
      setTotalPages(Math.ceil((data.total || 0) / PAGE_SIZE));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchValue]);

  useEffect(() => {
    setPage(1);
    fetchPrompts(1);
  }, [fetchPrompts]);

  const handleSearch = () => {
    setPage(1);
    fetchPrompts(1);
  };

  const goToPage = (p: number) => {
    setPage(p);
    fetchPrompts(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandom = async () => {
    try {
      const res = await fetch('/api/prompts?random=1');
      const data = await res.json();
      if (data.prompts?.[0]) setSelectedPrompt(data.prompts[0]);
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen" style={{ paddingTop: 100, paddingBottom: 80 }}>
      {/* Header */}
      <section style={{ padding: '0 24px', maxWidth: 1400, margin: '0 auto 8px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-3xl font-bold mb-2">
            <span style={{ color: 'var(--text-primary)' }}>提示词 </span>
            <span className="gradient-text">画廊</span>
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            浏览所有精选 AI 图像提示词，支持分类筛选和搜索。
          </p>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            onRandom={handleRandom}
            placeholder="搜索提示词..."
          />
        </motion.div>
      </section>

      {/* Categories */}
      <section style={{ padding: '20px 24px 0', maxWidth: 1400, margin: '0 auto' }}>
        <CategoryTags
          activeCategory={activeCategory}
          onSelect={(cat) => { setActiveCategory(cat); setPage(1); }}
        />
      </section>

      {/* Grid */}
      <section style={{ padding: '24px 24px 0', maxWidth: 1400, margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {loading && page === 1 ? '加载中...' : `${prompts.length} 条结果`}
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
          {prompts.length === 0 && !loading ? (
            <div className="col-span-full text-center py-20">
              <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>暂无结果</p>
            </div>
          ) : (
            <>
              {prompts.map((prompt, index) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  index={index % 12}
                  onClick={() => setSelectedPrompt(prompt)}
                />
              ))}
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={`sk-${i}`} />
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '48px 0 0',
          }}>
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page <= 1 || loading}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, opacity: page <= 1 ? 0.4 : 1 }}
            >
              <ChevronLeft className="w-4 h-4" />
              上一页
            </button>
            <span style={{ color: 'var(--text-secondary)', fontSize: 13, letterSpacing: '0.04em' }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages || loading}
              className="btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 8, opacity: page >= totalPages ? 0.4 : 1 }}
            >
              下一页
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      <PromptModal
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
        onLikeChange={(id, delta) => {
          setPrompts((prev) =>
            prev.map((p) => p.id === id ? { ...p, likeCount: Math.max(0, p.likeCount + delta) } : p)
          );
          setSelectedPrompt((prev) =>
            prev && prev.id === id ? { ...prev, likeCount: Math.max(0, prev.likeCount + delta) } : prev
          );
        }}
      />
    </div>
  );
}
