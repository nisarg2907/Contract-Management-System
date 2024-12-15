"use client";
import { useNotifications } from '@/hooks/use-notifications';
// import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

export default function UpdatesPage() {
  const { 
    notifications, 
    isLoading, 
    markNotificationsAsRead 
  } = useNotifications();
 
  console.log("notifications", notifications);

  if (isLoading) {
    return <div>Loading notifications...</div>;
  }

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);
  console.log("notifications length", notifications.length, unreadNotifications.length, readNotifications.length);

  const handleMarkAsRead = () => {
    const notificationIds = unreadNotifications.map(n => n.id);
    markNotificationsAsRead(notificationIds);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Live Updates</h1>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <>
          {unreadNotifications.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">New Notifications</h2>
              {unreadNotifications.map(notification => (
                <Card key={notification.id} className="mb-4 border-primary">
                  <CardHeader>
                    <CardTitle>Contract Update <span className="text-primary">(New)</span></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <div>
                        <p>Contract ID: {notification.contractId}</p>
                        <p>Status: {notification.status}</p>
                        <p>{notification.message}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(notification.createdAt), 'PPp')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button onClick={handleMarkAsRead} className="mt-4">Mark as Read</Button>
            </>
          )}
          {readNotifications.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Previous Notifications</h2>
              {readNotifications.map(notification => (
                <Card key={notification.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>Contract Update</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <div>
                        <p>Title : {notification.contract.title}</p>
                        <p>Status: {notification.status}</p>
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
        </>
      )}
    </div>
  );
}