'use client';

import Image from 'next/image';
import { Card } from '../ui/Card';
import { Heart, Star, MessageCircle } from 'lucide-react';

// Demo gallery items
const demoItems = [
  {
    id: 1,
    title: '杭州西湖',
    style: '水彩风',
    likes: 234,
    comments: 45,
    image: '🗾',
  },
  {
    id: 2,
    title: '京都祗园',
    style: '复古风',
    likes: 189,
    comments: 32,
    image: '🏯',
  },
  {
    id: 3,
    title: '巴黎埃菲尔铁塔',
    style: '漫画风',
    likes: 456,
    comments: 78,
    image: '🗼',
  },
  {
    id: 4,
    title: '纽约时代广场',
    style: '扁平风',
    likes: 321,
    comments: 56,
    image: '🌆',
  },
  {
    id: 5,
    title: '希腊圣托里尼',
    style: '水彩风',
    likes: 567,
    comments: 89,
    image: '🏝️',
  },
  {
    id: 6,
    title: '上海外滩',
    style: '素描风',
    likes: 198,
    comments: 34,
    image: '🌃',
  },
];

export function GalleryPreview() {
  return (
    <section className="section">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="gradient-text">精选作品</span>
            </h2>
            <p className="text-light-text-secondary">
              看看其他人创作的手绘地图
            </p>
          </div>
          <a
            href="/gallery"
            className="text-light-primary hover:text-light-primary/80 font-medium transition-colors"
          >
            查看全部 →
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {demoItems.map((item) => (
            <Card
              key={item.id}
              className="aspect-[4/3] relative group overflow-hidden cursor-pointer"
            >
              {/* Placeholder for demo - in production, this would be actual images */}
              <div className="absolute inset-0 bg-gradient-to-br from-light-primary/10 to-light-secondary/10 flex items-center justify-center">
                <span className="text-6xl">{item.image}</span>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-white/80 mb-3">{item.style}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-sm">
                      <Heart className="w-4 h-4" />
                      {item.likes}
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      {item.comments}
                    </span>
                  </div>
                </div>
              </div>

              {/* Style badge */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 text-xs font-medium text-light-text">
                {item.style}
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/create"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-light-primary to-light-secondary text-white rounded-xl font-semibold shadow-lg shadow-light-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <span>创作你的第一张手绘地图</span>
          </a>
        </div>
      </div>
    </section>
  );
}
