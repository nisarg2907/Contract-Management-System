"use client";
import { useNotifications } from '@/hooks/use-notifications';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

export default function UpdatesPage() {
  const { 
    notifications, 
    isLoading, 
    markNotificationsAsRead 
  } = useNotifications();
 
  useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const notificationIds = unreadNotifications.map(n => n.id);
    if (notificationIds.length > 0) {
      markNotificationsAsRead(notificationIds);
    }
  }, [notifications, markNotificationsAsRead]);

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Live Updates</h1>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <>
          {notifications.map(notification => (
            <Card key={notification.id} className={`mb-4 ${!notification.isRead ? 'border-primary' : ''}`}>
              <CardHeader>
                <CardTitle>Contract Update { !notification.isRead && <span className="text-primary">(New)</span> }</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    {/* <p>Contract ID: {notification.contractId}</p> */}
                       {/* <p>Contract ID: {notification.contractId}</p> */}
                    <p>Status: <strong>{notification.status}</strong></p>
                    <p>Title: {notification.contract.title}</p>
                    <p>Type: {notification.contract.type}</p>
                    {/* <p>{notification.message}</p> */}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(notification.createdAt), 'PPp')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}