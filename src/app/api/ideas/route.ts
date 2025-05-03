import { NextResponse } from 'next/server';
import { addIdea, getIdeas } from '@/lib/db';

export async function GET() {
  try {
    const ideas = getIdeas();
    return NextResponse.json(ideas);
  } catch (error) {
    console.error('获取想法列表失败:', error);
    return NextResponse.json(
      { error: '获取想法列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, playerName } = await request.json();

    if (!content || !playerName) {
      return NextResponse.json(
        { error: '内容和玩家名不能为空' },
        { status: 400 }
      );
    }

    const newIdea = addIdea(content, playerName);
    return NextResponse.json(newIdea);
  } catch (error) {
    console.error('添加想法失败:', error);
    return NextResponse.json(
      { error: '添加想法失败' },
      { status: 500 }
    );
  }
}