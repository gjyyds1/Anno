// 意见反馈类型定义
export interface Idea {
  id: string;
  content: string;
  playerName: string;
  createdAt: string;
}

// Bug报告类型定义
export interface Bug {
  id: string;  // 格式: GC-number
  content: string;
  playerName: string;
  createdAt: string;
  status: 'open' | 'closed' | 'cannot' | 'fake' | 'feature' | 'ok';
}

// 数据库结构定义
export interface Database {
  ideas: Idea[];
  bugs: Bug[];
  bugCounter: number;
}