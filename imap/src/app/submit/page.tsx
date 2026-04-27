'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Upload, Image, Code, Check, AlertCircle } from 'lucide-react';
import { CategoryTags } from '@/components/CategoryTags';

const CATEGORIES = [
  '个人资料 / 头像', '社交媒体帖子', '信息图 / 教育视觉图',
  'YouTube 缩略图', '漫画 / 故事板', '海报 / 传单', 'APP / 网页设计',
];

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

      if (!res.ok) {
        throw new Error('提交失败');
      }

      setStatus('success');
      setTimeout(() => {
        router.push('/');
      }, 2000);
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
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen" style={{ padding: '100px 24px 80px', maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div
          className="inline-flex items-center gap-3 mb-4 px-5 py-2 rounded-full"
          style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
        >
          <Upload className="w-5 h-5" style={{ color: '#B24592' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            贡献你的创意
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="gradient-text">提交提示词</span>
        </h1>
        <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
          分享你的 GPT Image 2 提示词，帮助更多人创作出精彩的 AI 图像
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            标题 <span style={{ color: '#F15F79' }}>*</span>
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="简要描述这个提示词的效果和用途..."
            className="input-dark"
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
            分类 <span style={{ color: '#F15F79' }}>*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: category === cat ? 'var(--accent-gradient)' : 'var(--bg-tertiary)',
                  color: category === cat ? 'white' : 'var(--text-secondary)',
                  border: category === cat ? 'none' : '1px solid var(--border)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            图片 URL <span style={{ color: '#F15F79' }}>*</span>
          </label>
          <div className="space-y-3">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder="https://example.com/your-image.jpg"
              className="input-dark"
              required
            />
            {imagePreview && (
              <div className="relative rounded-xl overflow-hidden" style={{ maxHeight: 300 }}>
                <img
                  src={imagePreview}
                  alt="预览"
                  className="w-full object-cover"
                  style={{ maxHeight: 300 }}
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Prompt Text */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              提示词 <span style={{ color: '#F15F79' }}>*</span>
            </label>
            <button
              type="button"
              onClick={parsePromptJson}
              className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
              style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
            >
              <Code className="w-3 h-3" />
              格式化 JSON
            </button>
          </div>
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder={'{\n  "type": "海报设计",\n  "subject": "...",\n  "style": "..."\n}'}
            className="input-dark font-mono text-sm"
            rows={10}
            style={{ resize: 'vertical', fontFamily: 'var(--font-geist-mono), monospace' }}
            required
          />
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            支持 JSON 格式或纯文本提示词
          </p>
        </div>

        {/* Author Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            昵称（游客提交）
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="输入你的昵称（选填）"
            className="input-dark"
          />
        </div>

        {/* Status Messages */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' }}
          >
            <Check className="w-5 h-5" style={{ color: '#22c55e' }} />
            <span style={{ color: '#22c55e' }}>提交成功！正在跳转...</span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
            <span style={{ color: '#ef4444' }}>{errorMsg}</span>
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full justify-center py-4 text-base disabled:opacity-50"
        >
          {submitting ? (
            <>
              <span className="animate-spin">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </span>
              提交中...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              提交提示词
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
}
