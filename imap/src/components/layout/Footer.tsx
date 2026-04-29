import Link from 'next/link';

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '48px 24px 32px',
        maxWidth: 1200,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 32,
        }}
      >
        {/* Brand */}
        <div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              marginBottom: 8,
            }}
          >
            墨辞
          </h3>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13, lineHeight: 1.7 }}>
            探索 AI 图像提示词的无限可能
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              marginBottom: 12,
            }}
          >
            探索
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>
              <Link
                href="/"
                style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}
              >
                首页
              </Link>
            </li>
            <li>
              <Link
                href="/gallery"
                style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}
              >
                画廊
              </Link>
            </li>
            <li>
              <Link
                href="/submit"
                style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}
              >
                投稿
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              marginBottom: 12,
            }}
          >
            分类
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['个人资料 / 头像', '海报 / 传单', '漫画 / 故事板', '信息图 / 教育视觉图'].map((cat) => (
              <li key={cat}>
                <Link
                  href={`/?category=${encodeURIComponent(cat)}`}
                  style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none' }}
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              marginBottom: 12,
            }}
          >
            关于
          </h4>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 13, lineHeight: 1.7 }}>
            墨辞是一个开源的 AI 提示词社区，灵感来源于 youmind.com。
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border)',
          marginTop: 32,
          paddingTop: 16,
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--text-tertiary)', fontSize: 12, letterSpacing: '0.04em' }}>
          © {new Date().getFullYear()} 墨辞. 数据来源于 youmind.com
        </p>
      </div>
    </footer>
  );
}