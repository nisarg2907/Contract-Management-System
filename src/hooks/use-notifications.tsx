"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Notification, Contract } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface NotificationWithContract extends Notification {
  contract: Contract;
}

export const useNotifications = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<NotificationWithContract[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/notifications/all');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markNotificationsAsRead = async (notificationIds: string[]) => {
    try {
      await axios.patch('/api/notifications/read', { notificationIds });
      
      localStorage.setItem('notifications_read', JSON.stringify({
        ids: notificationIds,
        timestamp: Date.now()
      }));

      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification.id) 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      setUnreadCount(0);
      
      localStorage.removeItem('newUpdatesCount');
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  };

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notifications_read') {
        fetchNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    fetchNotifications();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [session?.user?.id]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markNotificationsAsRead,
    refetch: fetchNotifications
  };
};