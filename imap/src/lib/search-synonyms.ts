/**
 * Search synonym expansion — maps user search terms to related keywords
 * so that "职业照" also matches "头像", "LinkedIn", "profile" etc.
 */

export const SYNONYM_MAP: Record<string, string[]> = {
  // 头像 / 个人资料
  '头像': ['头像', 'profile', 'avatar', '肖像', '职业照', 'LinkedIn', '证件照', 'headshot', '自画像'],
  '职业照': ['头像', 'profile', '职业', 'LinkedIn', 'headshot', '简历照', '证件照'],
  '肖像': ['头像', 'portrait', '肖像', 'profile', '自画像', '人像'],
  '证件照': ['头像', '证件', 'ID photo', '护照', '职业照'],
  '简历': ['头像', '简历', 'resume', 'CV', '职业照', '个人资料'],

  // 社交媒体
  '朋友圈': ['社交媒体', 'social media', '帖子', 'post', 'Instagram', '分享'],
  '社交媒体': ['社交媒体', 'social media', '帖子', 'post', 'Instagram', '朋友圈', '分享', '样机'],
  '帖子': ['帖子', 'post', '社交媒体', 'social media', 'Instagram', '朋友圈'],
  'Instagram': ['Instagram', 'IG', '社交媒体', '帖子', 'social media'],
  '小红书': ['小红书', 'red note', '社交媒体', '帖子', '种草'],

  // 海报 / 传单
  '海报': ['海报', 'poster', '传单', 'flyer', '宣传', '活动', '邀请函', 'banner'],
  '传单': ['传单', 'flyer', '海报', '宣传单', '广告'],
  '邀请函': ['邀请函', 'invitation', '婚礼', '活动', '海报'],
  '活动': ['活动', 'event', '海报', '宣传', '邀请函'],
  '宣传': ['宣传', '海报', '广告', '传单', 'banner', '营销'],

  // 信息图
  '信息图': ['信息图', 'infographic', '图解', '数据可视化', '时间轴', '流程图', 'diagram'],
  '图解': ['图解', '信息图', 'infographic', '流程图', 'diagram', '说明'],
  '时间轴': ['时间轴', 'timeline', '信息图', 'infographic', '历史'],
  '流程图': ['流程图', '信息图', 'diagram', '流程', '图解'],
  '数据可视化': ['数据可视化', '图表', '信息图', 'infographic', 'chart'],

  // 漫画 / 故事板
  '漫画': ['漫画', 'comic', 'manga', '故事板', 'storyboard', '连环画', '动漫', '分镜'],
  '故事板': ['故事板', 'storyboard', '漫画', 'comic', '分镜', '脚本'],
  '动漫': ['动漫', '漫画', 'manga', 'anime', '二次元'],

  // YouTube
  '缩略图': ['缩略图', 'thumbnail', 'YouTube', '视频封面', '封面'],
  '视频封面': ['视频封面', '缩略图', 'thumbnail', 'YouTube', '封面'],
  'YouTube': ['YouTube', '缩略图', 'thumbnail', '视频封面'],

  // 产品展示
  '产品': ['产品', 'product', '商品', '展示', '电商', '拍摄'],
  '商品': ['商品', '产品', 'product', '电商', '展示', '拍摄'],
  '电商': ['电商', '产品', '商品', '展示', '拍摄', 'listing'],

  // APP / 网页
  '网页': ['网页', '网站', 'web', 'UI', '界面', '登录', 'mockup', 'landing'],
  'APP': ['APP', '应用', '界面', 'UI', 'web', 'mockup', 'login', '登录'],
  'UI': ['UI', '界面', '网页', 'APP', 'mockup', '设计', 'UX'],
  '登录页': ['登录', 'login', '网页', 'APP', 'UI', '注册'],

  // 时尚 / 服装
  '时尚': ['时尚', 'fashion', '服装', '穿搭', '衣服', '潮流', '搭配'],
  '穿搭': ['穿搭', '时尚', 'fashion', '服装', '搭配', 'OOTD'],
  '服装': ['服装', '时尚', 'fashion', '衣服', '穿搭', '设计'],

  // 建筑 / 室内
  '建筑': ['建筑', 'architecture', '室内', 'interior', '房子', '空间', '装修'],
  '室内设计': ['室内', 'interior', '装修', '空间', '建筑', '家居'],
  '装修': ['装修', '室内', 'interior', '设计', '家居', '建筑'],

  // 通用热门词
  'LOGO': ['LOGO', 'logo', '品牌', '标志', 'brand', '商标', 'icon'],
  '品牌': ['品牌', 'brand', 'LOGO', '标志', '视觉识别'],
  '插画': ['插画', 'illustration', '绘画', '漫画', '手绘', '艺术'],
  '艺术': ['艺术', 'art', '插画', '绘画', '手绘', 'creative'],
  '手绘': ['手绘', 'hand drawn', '插画', '绘画', 'sketch', '素描'],
  '简约': ['简约', 'minimal', '极简', '简单', 'clean', '现代'],
  '可爱': ['可爱', 'cute', 'kawaii', '萌', '卡通', '温馨'],
  '创意': ['创意', 'creative', '创新', '设计', '独特', '灵感'],
  '复古': ['复古', 'retro', 'vintage', '怀旧', '经典', '老式'],
  '卡通': ['卡通', 'cartoon', '可爱', 'cute', '动漫', 'Q版'],
  '3D': ['3D', '三维', '立体', '3D render', '渲染', 'blender'],
  '中国风': ['中国风', '国风', '水墨', 'Chinese style', '传统', '东方'],
  '赛博朋克': ['赛博朋克', 'cyberpunk', '科幻', '未来', '霓虹'],
  '像素': ['像素', 'pixel', '8bit', '复古游戏', 'retro game'],
};

// Category keyword mapping — maps search terms to categories
export const SEARCH_TO_CATEGORY: Record<string, string> = {
  '头像': '个人资料 / 头像',
  'profile': '个人资料 / 头像',
  'avatar': '个人资料 / 头像',
  'LinkedIn': '个人资料 / 头像',
  '职业照': '个人资料 / 头像',
  '证件照': '个人资料 / 头像',
  '简历': '个人资料 / 头像',
  'portrait': '个人资料 / 头像',
  '自画像': '个人资料 / 头像',
  '朋友圈': '社交媒体帖子',
  'Instagram': '社交媒体帖子',
  '小红书': '社交媒体帖子',
  '帖子': '社交媒体帖子',
  '社交媒体': '社交媒体帖子',
  'social media': '社交媒体帖子',
  '信息图': '信息图 / 教育视觉图',
  'infographic': '信息图 / 教育视觉图',
  '图解': '信息图 / 教育视觉图',
  '数据可视化': '信息图 / 教育视觉图',
  '漫画': '漫画 / 故事板',
  'comic': '漫画 / 故事板',
  '动漫': '漫画 / 故事板',
  '分镜': '漫画 / 故事板',
  '缩略图': 'YouTube 缩略图',
  'thumbnail': 'YouTube 缩略图',
  '视频封面': 'YouTube 缩略图',
  'YouTube': 'YouTube 缩略图',
  '海报': '海报 / 传单',
  'poster': '海报 / 传单',
  '传单': '海报 / 传单',
  '邀请函': '海报 / 传单',
  '宣传': '海报 / 传单',
  '活动': '海报 / 传单',
  '产品': '产品展示',
  'product': '产品展示',
  '电商': '产品展示',
  '商品': '产品展示',
  '拍摄': '产品展示',
  'APP': 'APP / 网页设计',
  '网页': 'APP / 网页设计',
  'UI': 'APP / 网页设计',
  '登录': 'APP / 网页设计',
  '界面': 'APP / 网页设计',
  '时尚': '时尚 / 服装',
  'fashion': '时尚 / 服装',
  '穿搭': '时尚 / 服装',
  '服装': '时尚 / 服装',
  '建筑': '建筑 / 室内设计',
  '室内': '建筑 / 室内设计',
  '装修': '建筑 / 室内设计',
};

/** Expand a search term into related keywords for broader matching */
export function expandSearchTerm(term: string): string[] {
  const trimmed = term.trim();
  if (!trimmed) return [];

  // Check exact match first
  if (SYNONYM_MAP[trimmed]) return SYNONYM_MAP[trimmed];

  // Check case-insensitive match
  const lower = trimmed.toLowerCase();
  for (const [key, values] of Object.entries(SYNONYM_MAP)) {
    if (key.toLowerCase() === lower) return values;
  }

  // Check if term is contained in any key
  for (const [key, values] of Object.entries(SYNONYM_MAP)) {
    if (key.includes(trimmed) || trimmed.includes(key)) return values;
  }

  // No match — return the original term
  return [trimmed];
}

/** Find a matching category for a search term */
export function findCategoryForSearch(term: string): string | null {
  const trimmed = term.trim();
  if (!trimmed) return null;

  if (SEARCH_TO_CATEGORY[trimmed]) return SEARCH_TO_CATEGORY[trimmed];

  const lower = trimmed.toLowerCase();
  for (const [key, cat] of Object.entries(SEARCH_TO_CATEGORY)) {
    if (key.toLowerCase() === lower) return cat;
  }

  return null;
}