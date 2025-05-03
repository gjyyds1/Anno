import { NextResponse } from 'next/server';
import { addBug, getBugs, updateBugStatus } from '@/lib/db';

export async function GET() {
  try {
    const bugs = getBugs();
    return NextResponse.json(bugs);
  } catch (error) {
    console.error('获取bug列表失败:', error);
    return NextResponse.json(
      { error: '获取bug列表失败' },
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

    const newBug = addBug(content, playerName);
    return NextResponse.json(newBug);
  } catch (error) {
    console.error('添加bug失败:', error);
    return NextResponse.json(
      { error: '添加bug失败' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    // 验证状态值是否有效
if (!['open', 'closed', 'cannot', 'fake', 'feature', 'ok'].includes(status)) {
  return NextResponse.json(
    { error: '无效的状态值' },
    { status: 400 }
  );
}

const updatedBug = updateBugStatus(id, status);
    if (!updatedBug) {
      return NextResponse.json(
        { error: '未找到指定的bug' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBug);
  } catch (error) {
    console.error('更新bug状态失败:', error);
    return NextResponse.json(
      { error: '更新bug状态失败' },
      { status: 500 }
    );
  }
}