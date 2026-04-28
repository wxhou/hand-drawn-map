import { config } from 'dotenv';
config();
import fs from 'fs';

const TURSO_URL = process.env.TURSO_DATABASE_URL || '';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN || '';
const TURSO_HTTP = TURSO_URL.replace('libsql://', 'https://');
const AUTH = 'Bearer ' + TURSO_TOKEN;

interface YoumindPrompt {
  id: number;
  title: string;
  description?: string;
  content: string;
  translatedContent?: string;
  media?: string[];
  author?: { name: string };
  featured?: boolean;
  likes?: number;
}

// Turso v2 Pipeline API requires typed args
function t(v: string | null): object { return v === null ? { type: 'null' } : { type: 'text', value: v }; }
function ti(v: number): object { return { type: 'integer', value: String(v) }; }

function inferCategory(title: string, content: string): string {
  const t = (title + ' ' + content).toLowerCase();
  if (/头像|肖像|profile|avatar|linkedin|职业|portrait|headshot/i.test(t)) return '个人资料 / 头像';
  if (/漫画|manga|comic|storyboard|动漫|故事板|跨页/i.test(t)) return '漫画 / 故事板';
  if (/youtube|缩略图|thumbnail|视频封面/i.test(t)) return 'YouTube 缩略图';
  if (/信息图|infographic|图解|时间轴|演化|slides|讲解|地图|diagram/i.test(t)) return '信息图 / 教育视觉图';
  if (/直播|social.?media|社交媒体|帖子|样机|ui.?mockup/i.test(t)) return '社交媒体帖子';
  if (/\bapp\b|网页|登录|界面|mockup|login/i.test(t)) return 'APP / 网页设计';
  if (/产品|product|展示|拍摄|商品/i.test(t)) return '产品展示';
  if (/时尚|服装|fashion|穿搭/i.test(t)) return '时尚 / 服装';
  if (/建筑|室内|architecture|interior/i.test(t)) return '建筑 / 室内设计';
  return '海报 / 传单';
}

async function tursoPipeline(stmts: { sql: string; args: any[] }[]) {
  const requests = stmts.map(s => ({ type: 'execute', stmt: s })).concat({ type: 'close' } as any);
  const res = await fetch(TURSO_HTTP + '/v2/pipeline', {
    method: 'POST',
    headers: { 'Authorization': AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requests }),
  });
  if (!res.ok) throw new Error(`Turso ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchYoumindPage(page: number, limit: number) {
  const res = await fetch('https://youmind.com/youhome-api/prompts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Origin': 'https://youmind.com',
      'Referer': 'https://youmind.com/zh-CN/gpt-image-2-prompts',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Google Chrome";v="147", "Chromium";v="147", "Not/A)Brand";v="8"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    },
    body: JSON.stringify({
      model: 'gpt-image-2', page, limit,
      locale: 'zh-CN', campaign: 'gpt-image-2-prompts',
      filterMode: 'imageCategories',
    }),
  });
  if (!res.ok) throw new Error(`Youmind ${res.status}`);
  return res.json();
}

async function main() {
  if (!TURSO_URL || !TURSO_TOKEN) {
    console.error('Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
    process.exit(1);
  }

  console.log('Fetching youmind total...');
  const first = await fetchYoumindPage(1, 1);
  const total = first.total;
  const pages = Math.ceil(total / 100);
  console.log(`Total: ${total}, Pages: ${pages}`);

  let inserted = 0, skipped = 0, errors = 0;

  for (let page = 1; page <= pages; page++) {
    console.log(`Page ${page}/${pages}...`);

    let prompts: YoumindPrompt[];
    try {
      const data = await fetchYoumindPage(page, 100);
      prompts = data.prompts;
    } catch (e: any) {
      console.error(`  Error: ${e.message}, retrying in 5s...`);
      await new Promise(r => setTimeout(r, 5000));
      try {
        const data = await fetchYoumindPage(page, 100);
        prompts = data.prompts;
      } catch {
        console.error(`  Retry failed, skipping`);
        errors += 100;
        continue;
      }
    }

    const stmts: { sql: string; args: any[] }[] = [];
    for (const p of prompts) {
      const promptText = (p.translatedContent || p.content || '').substring(0, 10000);
      const title = (p.title || '').substring(0, 200);
      const imageUrl = (p.media?.[0] || '').substring(0, 500);
      if (!title || !promptText || !imageUrl) { skipped++; continue; }

      const category = inferCategory(title, (p.description || '') + ' ' + promptText);
      stmts.push({
        sql: "INSERT OR IGNORE INTO Prompt (id, title, description, promptText, imageUrl, category, authorName, likeCount, viewCount, isFeatured, source, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))",
        args: [
          t('ym_' + p.id), t(title), t((p.description || '').substring(0, 500) || null),
          t(promptText), t(imageUrl), t(category),
          t((p.author?.name || '匿名用户').substring(0, 50)),
          ti(p.likes || 0), ti(0), ti(p.featured ? 1 : 0), t('youmind'),
        ],
      });
    }

    if (stmts.length === 0) continue;

    for (let i = 0; i < stmts.length; i += 20) {
      const batch = stmts.slice(i, i + 20);
      try {
        await tursoPipeline(batch);
        inserted += batch.length;
      } catch (e: any) {
        console.error(`  Turso: ${e.message}`);
        errors += batch.length;
      }
    }

    console.log(`  Progress: inserted=${inserted} skipped=${skipped} errors=${errors}`);
    if (page < pages) await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}, Errors: ${errors}`);
}

main().catch(console.error);