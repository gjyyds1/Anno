import fs from 'fs';
import path from 'path';

const ANNOUNCEMENTS_DIR = path.join(process.cwd(), 'src/data/announcements');

interface Announcement {
  title: string;
  date: string;
  content: string;
  filename: string;
}

// 获取所有公告
export function getAnnouncements(): Announcement[] {
  const files = fs.readdirSync(ANNOUNCEMENTS_DIR)
    .filter(file => file.endsWith('.md') && file !== 'README.md');

  return files.map(filename => {
    const filePath = path.join(ANNOUNCEMENTS_DIR, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // 从文件名解析日期和标题
    const parts = filename.replace('.md', '').split('-');
    // 确保日期格式为YYYY-MM-DD
    const date = parts.slice(0, 3).join('-');
    const title = parts.slice(3).join('-');

    return {
      title,
      date,
      content,
      filename
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// 获取单个公告
export function getAnnouncement(filename: string): Announcement | null {
  const filePath = path.join(ANNOUNCEMENTS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const parts = filename.replace('.md', '').split('-');
  // 确保日期格式为YYYY-MM-DD
  const date = parts.slice(0, 3).join('-');
  const title = parts.slice(3).join('-');

  return {
    title,
    date,
    content,
    filename
  };
}