import Link from 'next/link';
import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-light-surface border-t border-light-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-light-primary to-light-secondary bg-clip-text text-transparent">
              手绘地图
            </h3>
            <p className="text-light-text-secondary text-sm">
              用 AI 将有意义的地方变成独特的艺术礼物
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">产品</h4>
            <ul className="space-y-2 text-sm text-light-text-secondary">
              <li>
                <Link href="/gallery" className="hover:text-light-text transition-colors">
                  画廊
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-light-text transition-colors">
                  模板
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-light-text transition-colors">
                  价格
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">公司</h4>
            <ul className="space-y-2 text-sm text-light-text-secondary">
              <li>
                <Link href="/about" className="hover:text-light-text transition-colors">
                  关于我们
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-light-text transition-colors">
                  联系我们
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-light-text transition-colors">
                  博客
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">关注我们</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-light-background hover:bg-light-border/50 transition-colors"
              >
                <Github className="h-5 w-5 text-light-text-secondary" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-light-background hover:bg-light-border/50 transition-colors"
              >
                <Twitter className="h-5 w-5 text-light-text-secondary" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-light-background hover:bg-light-border/50 transition-colors"
              >
                <Mail className="h-5 w-5 text-light-text-secondary" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-light-border/50 mt-8 pt-8 text-center text-sm text-light-text-muted">
          <p>&copy; {new Date().getFullYear()} 手绘地图. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
}
