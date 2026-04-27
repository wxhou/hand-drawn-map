'use client';

import { motion } from 'framer-motion';
import { Heart, Tag } from 'lucide-react';

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    description?: string | null;
    imageUrl: string;
    category: string;
    authorName: string;
    authorAvatar?: string | null;
    likeCount: number;
    source: string;
    createdAt: string;
  };
  index: number;
  onClick: () => void;
}

export function PromptCard({ prompt, index, onClick }: PromptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group cursor-pointer"
      style={{
        backgroundColor: 'rgba(19, 19, 26, 0.7)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px) scale(1.02)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 24px 48px rgba(0,0,0,0.4), 0 0 40px rgba(178,69,146,0.12)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(178,69,146,0.5)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
      }}
    >
      <button
        onClick={onClick}
        className="w-full text-left"
        style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {/* Image — fixed 16:10 ratio: container clips overflow, img controls its own ratio */}
        <div style={{ width: '100%', overflow: 'hidden', flexShrink: 0, position: 'relative', aspectRatio: '16/10' }}>
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ display: 'block', aspectRatio: '16/10', width: '100%' }}
            loading="lazy"
          />
          {/* Category badge — top left */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {prompt.category}
          </div>
          {/* Like badge — bottom right */}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              padding: '4px 10px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: '#F15F79',
              border: '1px solid rgba(241,95,121,0.3)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Heart style={{ width: 12, height: 12, fill: '#F15F79', color: '#F15F79' }} />
            {prompt.likeCount}
          </div>
        </div>

        {/* Content area — fixed min-height so all cards in a row align */}
        <div className="p-4" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 100 }}>
          <h3
            className="font-semibold text-sm leading-snug"
            style={{
              background: 'var(--accent-gradient)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              minHeight: 36,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {prompt.title}
          </h3>

          <p
            className="text-xs line-clamp-2 leading-relaxed"
            style={{ color: 'var(--text-secondary)', flex: 1, minHeight: 32, marginTop: 6, marginBottom: 10 }}
          >
            {prompt.description || ''}
          </p>

          {/* Author — always at bottom */}
          <div
            className="flex items-center gap-2 pt-2.5 mt-auto"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {prompt.authorAvatar ? (
              <img
                src={prompt.authorAvatar}
                alt={prompt.authorName}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: 'var(--accent-gradient)', color: 'white' }}
              >
                {prompt.authorName[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>
              {prompt.authorName}
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

export function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 20,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="shimmer" style={{ aspectRatio: '16/10', flexShrink: 0 }} />
      <div className="p-4 space-y-3" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="shimmer h-4 w-3/4 rounded-lg" />
        <div className="shimmer h-3 w-full rounded-lg" />
        <div style={{ flex: 1 }} />
        <div className="flex justify-between pt-2.5" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="shimmer h-3 w-16 rounded" />
          <div className="shimmer h-3 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}
