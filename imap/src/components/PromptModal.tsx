'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Heart, Share2, Eye, Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { useSession } from 'next-auth/react';

const LIKES_KEY = 'imap_liked_ids';

function getLikedIds(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function saveLikedIds(ids: Set<string>) {
  localStorage.setItem(LIKES_KEY, JSON.stringify([...ids]));
}

interface PromptModalProps {
  prompt: {
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
    source: string;
    createdAt: string;
  } | null;
  onClose: () => void;
  onLikeChange?: (id: string, delta: number) => void;
}

export function PromptModal({ prompt, onClose, onLikeChange }: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (prompt) {
      setLiked(getLikedIds().has(prompt.id));
      setLikeCount(prompt.likeCount);
      setViewCount(prompt.viewCount);
      // Check favorite status
      if (session?.user?.id) {
        fetch('/api/favorites/check?promptId=' + prompt.id)
          .then(r => r.json())
          .then(data => setFavorited(data.favorited))
          .catch(() => {});
      } else {
        setFavorited(false);
      }
      // Increment view count
      fetch(`/api/prompts/${prompt.id}`).then(r => r.json()).then(data => {
        if (data.viewCount !== undefined) setViewCount(data.viewCount);
      }).catch(() => {});
    }
  }, [prompt]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (prompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [prompt]);

  const promptId = prompt?.id ?? '';

  const handleFavorite = useCallback(async () => {
    if (!promptId || !session?.user?.id) return;
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptId }),
      });
      const data = await res.json();
      setFavorited(data.favorited);
      toast(data.favorited ? '已收藏' : '已取消收藏', 'success');
    } catch {
      toast('操作失败', 'error');
    }
  }, [promptId, session, toast]);

  const handleLike = useCallback(async () => {
    if (!promptId) return;
    const likedIds = getLikedIds();
    const isLiked = likedIds.has(promptId);
    const delta = isLiked ? -1 : 1;

    try {
      const res = await fetch(`/api/prompts/${promptId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLiked ? { unlike: true } : {}),
      });
      const data = await res.json();
      setLikeCount(data.likeCount);
      setLiked(!isLiked);
      onLikeChange?.(promptId, delta);

      if (isLiked) {
        likedIds.delete(promptId);
      } else {
        likedIds.add(promptId);
      }
      saveLikedIds(likedIds);
    } catch {
      toast('操作失败', 'error');
    }
  }, [promptId, onLikeChange, toast]);

  if (!prompt) return null;

  const handleCopy = async () => {
    let text = prompt.promptText;
    try {
      JSON.parse(text);
      text = JSON.stringify(JSON.parse(text), null, 2);
    } catch { /* use as-is */ }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast('已复制到剪贴板', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast('复制失败，请手动复制', 'error');
    }
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('prompt', prompt.id);
    try {
      await navigator.clipboard.writeText(url.toString());
      toast('链接已复制', 'success');
    } catch {
      toast('分享失败', 'error');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  let promptDisplay = prompt.promptText;
  try {
    JSON.parse(prompt.promptText);
    promptDisplay = JSON.stringify(JSON.parse(prompt.promptText), null, 2);
  } catch {
    promptDisplay = prompt.promptText;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(13, 12, 11, 0.9)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-md transition-colors"
            style={{
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid md:grid-cols-2 max-h-[90vh]">
            {/* Image */}
            <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
              <img
                src={prompt.imageUrl}
                alt={prompt.title}
                className="w-full h-full object-cover"
                style={{ minHeight: 280 }}
              />
              <div
                className="absolute bottom-4 left-4 px-3 py-1 rounded text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(13, 12, 11, 0.75)',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                {prompt.category}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col p-6 md:p-8 gap-5 overflow-y-auto" style={{ maxHeight: '90vh' }}>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                <span>{formatDate(prompt.createdAt)}</span>
                <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{viewCount}</span>
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.02em',
                }}
              >
                {prompt.title}
              </h2>

              {/* Author */}
              <div className="flex items-center gap-3">
                {prompt.authorAvatar ? (
                  <img src={prompt.authorAvatar} alt={prompt.authorName} className="w-8 h-8 rounded-full" />
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'var(--accent-muted)',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {prompt.authorName[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{prompt.authorName}</div>
                </div>
              </div>

              {/* Description */}
              {prompt.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {prompt.description}
                </p>
              )}

              {/* Prompt box */}
              <div className="flex-1 min-h-0">
                <div
                  className="rounded-lg p-4 overflow-auto"
                  style={{ backgroundColor: 'var(--bg-primary)', maxHeight: 220 }}
                >
                  <pre
                    className="text-xs whitespace-pre-wrap break-all leading-relaxed"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                  >
                    {promptDisplay}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleCopy}
                  className="btn-primary flex-1 justify-center py-3 text-sm"
                  style={{ borderRadius: 8 }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已复制' : '复制 Prompt'}
                </button>
                <button
                  onClick={handleLike}
                  className="btn-secondary px-4 py-3 flex items-center gap-1"
                  style={{ borderRadius: 8 }}
                >
                  <Heart
                    className="w-4 h-4"
                    style={{
                      fill: liked ? 'var(--accent)' : 'none',
                      color: 'var(--accent)',
                    }}
                  />
                  <span className="text-xs">{likeCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="btn-secondary px-4 py-3"
                  style={{ borderRadius: 8 }}
                >
                  <Share2 className="w-4 h-4" />
                </button>
                {session?.user && (
                  <button
                    onClick={handleFavorite}
                    className="btn-secondary px-4 py-3"
                    style={{ borderRadius: 8 }}
                    title={favorited ? '取消收藏' : '收藏'}
                  >
                    {favorited ? (
                      <BookmarkCheck className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}