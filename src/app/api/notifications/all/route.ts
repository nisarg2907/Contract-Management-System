import {  NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/utils/db';


export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const notifications = await db.notification.findMany({
      where: { 
        user:{
          email:session.user.email as string
        },
        createdAt: { gte: thirtyDaysAgo }
      },
      orderBy: { 
        createdAt: 'desc' 
      },
      include: {
        contract: true 
      },
      take: 50 
    });

    // Count unread notifications
    const unreadCount = await db.notification.count({
      where: { 
        userId: session.user.id,
        isRead: false,
        createdAt: { gte: thirtyDaysAgo }
      }
    });

    return NextResponse.json({
      notifications,
      unreadCount: Math.min(unreadCount, 9)
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}