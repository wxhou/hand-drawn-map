'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

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
    source: string;
    createdAt: string;
  } | null;
  onClose: () => void;
  onLike?: () => void;
}

export function PromptModal({ prompt, onClose, onLike }: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (prompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [prompt]);

  if (!prompt) return null;

  const handleCopy = async () => {
    let text = prompt.promptText;
    try {
      JSON.parse(text);
      text = JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      // use as-is
    }
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
    try {
      await navigator.clipboard.writeText(window.location.href + '?prompt=' + prompt.id);
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95"
            style={{
              backgroundColor: 'rgba(26,26,36,0.8)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          >
            <X className="w-5 h-5" />
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
              {/* Category pill over image */}
              <div
                className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {prompt.category}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col p-6 md:p-8 gap-5 overflow-y-auto" style={{ maxHeight: '90vh' }}>
              {/* Date */}
              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {formatDate(prompt.createdAt)}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {prompt.title}
              </h2>

              {/* Author */}
              <div className="flex items-center gap-3">
                {prompt.authorAvatar ? (
                  <img src={prompt.authorAvatar} alt={prompt.authorName} className="w-10 h-10 rounded-full ring-2 ring-pink-500/30" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--accent-gradient)', color: 'white' }}
                  >
                    {prompt.authorName[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{prompt.authorName}</div>
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>用户提交</div>
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
                  className="rounded-2xl p-4 overflow-auto"
                  style={{ backgroundColor: 'var(--bg-tertiary)', maxHeight: 220 }}
                >
                  <pre
                    className="text-xs whitespace-pre-wrap break-all leading-relaxed"
                    style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}
                  >
                    {promptDisplay}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleCopy}
                  className="btn-primary flex-1 justify-center py-3.5 text-sm font-semibold"
                  style={{ borderRadius: 14 }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? '已复制' : '复制 Prompt'}
                </button>
                <button
                  onClick={onLike}
                  className="btn-secondary px-4 py-3.5"
                  style={{ borderRadius: 14 }}
                >
                  <Heart className="w-4 h-4" style={{ fill: '#F15F79', color: '#F15F79' }} />
                </button>
                <button
                  onClick={handleShare}
                  className="btn-secondary px-4 py-3.5"
                  style={{ borderRadius: 14 }}
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
