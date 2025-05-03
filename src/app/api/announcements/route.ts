import { NextResponse } from 'next/server';
import { getAnnouncements } from '@/lib/announcements';

export async function GET() {
  try {
    const announcements = getAnnouncements();
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('获取公告失败:', error);
    return NextResponse.json(
      { error: '获取公告失败' },
      { status: 500 }
    );
  }
}