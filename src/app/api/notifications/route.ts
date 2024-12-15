// app/api/notifications/route.ts
import {  NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/utils/db';


export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await db.notification.findMany({
      where: { 
      id:session.user.id,
        isRead: false 
      },
      orderBy: { 
        createdAt: 'desc' 
      },
      include: {
        contract: true 
      }
    });

    return NextResponse.json({
      notifications,
      unreadCount: Math.min(notifications.length, 9)
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}