'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, BookmarkX } from 'lucide-react';
import { PromptCard, SkeletonCard } from '@/components/PromptCard';
import { PromptModal } from '@/components/PromptModal';

interface FavoritePrompt {
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

interface Favorite {
  id: string;
  promptId: string;
  prompt: FavoritePrompt;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<FavoritePrompt | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status !== 'authenticated') return;

    fetch('/api/favorites')
      .then((r) => r.json())
      .then((data) => {
        setFavorites(data.favorites || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status, router]);

  const handleUnfavorite = async (promptId: string) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      });
      const data = await res.json();
      if (!data.favorited) {
        setFavorites((prev) => prev.filter((f) => f.promptId !== promptId));
      }
    } catch { /* ignore */ }
  };

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <div className="min-h-screen" style={{ paddingTop: 100, paddingBottom: 80, padding: '100px 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ paddingTop: 100, paddingBottom: 80, padding: '100px 24px 80px' }}>
      <section style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            <span style={{ color: 'var(--accent)', marginRight: 8 }}><Heart style={{ width: 24, height: 24, display: 'inline', fill: 'var(--accent)' }} /></span>
            我的收藏
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
            {favorites.length > 0 ? `共 ${favorites.length} 条收藏` : '还没有收藏任何提示词'}
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <BookmarkX style={{ width: 48, height: 48, color: 'var(--text-tertiary)', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)', fontSize: 18 }}>
              收藏夹为空
            </p>
            <p style={{ color: 'var(--text-tertiary)', fontSize: 13, marginTop: 8 }}>
              浏览提示词时点击收藏按钮即可添加
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 32,
              alignItems: 'stretch',
            }}
          >
            {favorites.map((fav, index) => (
              <PromptCard
                key={fav.id}
                prompt={fav.prompt}
                index={index % 12}
                onClick={() => setSelectedPrompt(fav.prompt)}
              />
            ))}
          </div>
        )}
      </section>

      <PromptModal
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
        onLikeChange={() => {}}
      />
    </div>
  );
}