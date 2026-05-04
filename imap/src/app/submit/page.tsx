'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Code, Check, AlertCircle, FileText, Tags, ImagePlus, MessageSquare, User } from 'lucide-react';
import { CategoryTags } from '@/components/CategoryTags';

const ink = {
  initial: { opacity: 0, y: 28 },
  animate: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: 'easeOut' as const },
  }),
};

function Section({ icon: Icon, title, required, children }: {
  icon: React.ElementType; title: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <motion.div
      custom={0}
      variants={ink}
      initial="initial"
      animate="animate"
    >
      <div style={{ marginBottom: 12 }}>
        <div className="flex items-center gap-2.5">
          <Icon style={{ width: 14, height: 14, color: required ? 'var(--accent)' : 'var(--text-tertiary)' }} />
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-serif)',
              letterSpacing: '0.04em',
            }}
          >
            {title}
          </span>
          {required && (
            <span
              style={{
                display: 'inline-block',
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent)',
              }}
            />
          )}
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export default function SubmitPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [promptText, setPromptText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !category || !promptText || !imageUrl) {
      setErrorMsg('请填写所有必填项');
      setStatus('error');
      return;
    }

    setSubmitting(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          promptText,
          imageUrl,
          authorName: authorName || '匿名用户',
        }),
      });

      if (!res.ok) throw new Error('提交失败');

      setStatus('success');
      setTimeout(() => { router.push('/'); }, 2000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : '提交失败，请重试');
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const parsePromptJson = () => {
    try {
      const parsed = JSON.parse(promptText);
      setPromptText(JSON.stringify(parsed, null, 2));
    } catch { /* ignore */ }
  };

  const filledCount = [title, category, promptText, imageUrl].filter(Boolean).length;

  return (
    <div className="min-h-screen" style={{ padding: '80px 20px 100px', maxWidth: 640, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        custom={0}
        variants={ink}
        initial="initial"
        animate="animate"
        style={{ marginBottom: 48 }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            lineHeight: 1.4,
            marginBottom: 12,
          }}
        >
          投稿
        </h1>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 14,
            lineHeight: 1.8,
            maxWidth: 320,
          }}
        >
          分享你的 GPT Image 2 提示词
        </p>
        {/* Progress */}
        <div className="flex items-center gap-1.5 mt-5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: i < filledCount ? 20 : 5,
                height: 5,
                background: i < filledCount ? 'var(--accent)' : 'rgba(232, 228, 223, 0.06)',
                transition: 'all 0.5s var(--ease-ink)',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--border-hover) 30%, var(--border-hover) 70%, transparent)',
          marginBottom: 36,
        }}
      />

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* Basic Info */}
        <Section icon={FileText} title="基本信息" required>
          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：赛博朋克城市夜景海报"
                className="input-dark"
                required
              />
            </div>
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                描述
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要描述这个提示词的效果和用途..."
                className="textarea-dark"
                rows={3}
              />
            </div>
          </div>
        </Section>

        {/* Category */}
        <Section icon={Tags} title="分类" required>
          <CategoryTags activeCategory={category} onSelect={setCategory} showAll={false} />
        </Section>

        {/* Visual */}
        <Section icon={ImagePlus} title="视觉素材" required>
          <div className="space-y-3">
            <div>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                图片 URL
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="https://example.com/your-image.jpg"
                className="input-dark"
                required
              />
            </div>
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-lg overflow-hidden"
                style={{
                  border: '1px solid var(--border)',
                  maxHeight: 240,
                }}
              >
                <img
                  src={imagePreview}
                  alt="预览"
                  className="w-full object-cover"
                  style={{ maxHeight: 240 }}
                  onError={() => setImagePreview('')}
                />
              </motion.div>
            )}
            {!imagePreview && (
              <div
                className="flex flex-col items-center justify-center rounded-lg py-10"
                style={{
                  border: '1px dashed rgba(232,228,223,0.08)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              >
                <ImagePlus className="w-6 h-6 mb-2" style={{ color: 'var(--text-tertiary)', opacity: 0.4 }} />
                <p className="text-xs" style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>
                  输入图片 URL 后在此预览
                </p>
              </div>
            )}
          </div>
        </Section>

        {/* Prompt Text */}
        <Section icon={MessageSquare} title="提示词" required>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
                提示词文本
              </label>
              <button
                type="button"
                onClick={parsePromptJson}
                className="text-xs px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors"
                style={{
                  backgroundColor: 'var(--accent-muted)',
                  border: '1px solid var(--accent-border)',
                  color: 'var(--accent)',
                }}
              >
                <Code className="w-3 h-3" />
                格式化
              </button>
            </div>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder={'{\n  "type": "海报设计",\n  "subject": "...",\n  "style": "..."\n}'}
              className="textarea-dark font-mono text-sm"
              rows={10}
              style={{ fontFamily: 'var(--font-mono)' }}
              required
            />
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              支持 JSON 或纯文本
            </p>
          </div>
        </Section>

        {/* Author */}
        <Section icon={User} title="署名">
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.04em' }}>
              昵称（选填）
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="默认匿名"
              className="input-dark"
            />
          </div>
        </Section>

        {/* Status */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-lg"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.06)', border: '1px solid rgba(34, 197, 94, 0.15)' }}
          >
            <Check className="w-4 h-4" style={{ color: '#22c55e' }} />
            <span className="text-sm" style={{ color: '#22c55e' }}>提交成功，正在跳转...</span>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-lg"
            style={{ backgroundColor: 'rgba(196, 69, 58, 0.06)', border: '1px solid var(--accent-border)' }}
          >
            <AlertCircle className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <span className="text-sm" style={{ color: 'var(--accent)' }}>{errorMsg}</span>
          </motion.div>
        )}

        {/* Submit */}
        <motion.div
          custom={0.3}
          variants={ink}
          initial="initial"
          animate="animate"
          style={{ paddingTop: 8 }}
        >
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-40"
            style={{
              background: 'var(--accent)',
              color: '#f5f0eb',
              border: 'none',
              cursor: submitting ? 'wait' : 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            {submitting ? (
              <>
                <span className="animate-spin">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </span>
                提交中
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                提交
              </>
            )}
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
}