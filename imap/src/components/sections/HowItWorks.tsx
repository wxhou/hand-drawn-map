'use client';

import { Sparkles, Palette, Download } from 'lucide-react';
import { Card } from '../ui/Card';

const steps = [
  {
    icon: Sparkles,
    title: '输入地点',
    description: '输入你想生成地图的城市、地标或任意地点名称',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: '选择风格',
    description: '从 5 种手绘风格中选择：水彩、漫画、素描、复古、扁平',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Download,
    title: '下载分享',
    description: '生成后可直接下载图片，或分享给朋友作为礼物',
    color: 'from-orange-500 to-yellow-500',
  },
];

export function HowItWorks() {
  return (
    <section className="section bg-light-surface/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">三步搞定</span>
          </h2>
          <p className="text-light-text-secondary max-w-2xl mx-auto">
            简单三步，将任何地点变成独特的手绘艺术作品
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              className="p-8 text-center group hover:shadow-xl transition-all duration-300"
            >
              <div className="relative inline-flex mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-light-background border-2 border-light-border flex items-center justify-center text-sm font-bold text-light-primary">
                  {index + 1}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-light-text-secondary">{step.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
