'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

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
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
      className="group cursor-pointer"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 10,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        transition: 'transform 0.5s var(--ease-ink), box-shadow 0.5s var(--ease-ink)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
      }}
    >
      <button
        onClick={onClick}
        className="w-full text-left"
        style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {/* Image */}
        <div style={{ width: '100%', overflow: 'hidden', flexShrink: 0, position: 'relative', aspectRatio: '16/10' }}>
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ display: 'block', aspectRatio: '16/10', width: '100%' }}
            loading="lazy"
          />
          {/* Category — bottom left, minimal pill */}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              backgroundColor: 'rgba(13, 12, 11, 0.75)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
          >
            {prompt.category}
          </div>
          {/* Likes — bottom right */}
          {prompt.likeCount > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                padding: '3px 8px',
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 500,
                backgroundColor: 'rgba(13, 12, 11, 0.75)',
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Heart style={{ width: 11, height: 11, fill: 'var(--accent)', color: 'var(--accent)' }} />
              {prompt.likeCount}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: 1.5,
              color: 'var(--text-primary)',
              minHeight: 42,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              letterSpacing: '0.02em',
            }}
          >
            {prompt.title}
          </h3>

          <p
            className="line-clamp-2"
            style={{
              color: 'var(--text-tertiary)',
              fontSize: 12,
              lineHeight: 1.7,
              flex: 1,
              marginTop: 8,
            }}
          >
            {prompt.description || ''}
          </p>

          {/* Author */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingTop: 14,
              marginTop: 12,
              borderTop: '1px solid var(--border)',
            }}
          >
            {prompt.authorAvatar ? (
              <img src={prompt.authorAvatar} alt={prompt.authorName} className="w-5 h-5 rounded-full" />
            ) : (
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: 'var(--accent-muted)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {prompt.authorName[0]?.toUpperCase()}
              </div>
            )}
            <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }} className="truncate">
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
        backgroundColor: 'var(--bg-card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="shimmer" style={{ aspectRatio: '16/10', flexShrink: 0 }} />
      <div className="p-4 space-y-3" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="shimmer h-4 w-3/4 rounded" />
        <div className="shimmer h-3 w-full rounded" />
        <div style={{ flex: 1 }} />
        <div className="flex justify-between pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="shimmer h-3 w-16 rounded" />
          <div className="shimmer h-3 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}