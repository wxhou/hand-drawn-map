'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { PromptCard, SkeletonCard } from '@/components/PromptCard';
import { CategoryTags } from '@/components/CategoryTags';
import { SearchBar } from '@/components/SearchBar';
import { PromptModal } from '@/components/PromptModal';

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
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchValue, setSearchValue] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPrompts = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pageNum.toString());
      params.set('limit', '12');
      if (activeCategory !== '全部') params.set('category', activeCategory);
      if (searchValue) params.set('search', searchValue);

      const res = await fetch(`/api/prompts?${params.toString()}`);
      const data = await res.json();
      if (reset) {
        setPrompts(data.prompts || []);
      } else {
        setPrompts((prev) => [...prev, ...(data.prompts || [])]);
      }
      setTotalPages(Math.ceil((data.total || 0) / 12));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchValue]);

  useEffect(() => {
    setPage(1);
    fetchPrompts(1, true);
  }, [fetchPrompts]);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && page < totalPages) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [loading, page, totalPages]);

  useEffect(() => {
    if (page > 1) fetchPrompts(page);
  }, [page, fetchPrompts]);

  const handleSearch = () => {
    setPage(1);
    fetchPrompts(1, true);
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
        <div ref={loadMoreRef} className="h-10" />
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
