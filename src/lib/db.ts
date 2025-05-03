import fs from 'fs';
import path from 'path';
import { Database, Idea, Bug } from '@/types';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

// 读取数据库
function readDb(): Database {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// 写入数据库
function writeDb(data: Database): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// 添加新想法
export function addIdea(content: string, playerName: string): Idea {
  const db = readDb();
  const newIdea: Idea = {
    id: Date.now().toString(),
    content,
    playerName,
    createdAt: new Date().toISOString()
  };
  db.ideas.push(newIdea);
  writeDb(db);
  return newIdea;
}

// 获取所有想法
export function getIdeas(): Idea[] {
  const db = readDb();
  return db.ideas;
}

// 添加新bug
export function addBug(content: string, playerName: string): Bug {
  const db = readDb();
  db.bugCounter++;
  const newBug: Bug = {
    id: `GC-${db.bugCounter}`,
    content,
    playerName,
    createdAt: new Date().toISOString(),
    status: 'open'
  };
  db.bugs.push(newBug);
  writeDb(db);
  return newBug;
}

// 获取所有bug
export function getBugs(): Bug[] {
  const db = readDb();
  return db.bugs;
}

// 更新bug状态
export function updateBugStatus(id: string, status: 'open' | 'closed'): Bug | null {
  const db = readDb();
  const bug = db.bugs.find(b => b.id === id);
  if (bug) {
    bug.status = status;
    writeDb(db);
    return bug;
  }
  return null;
}