'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import io  from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { Socket } from 'socket.io';

// Define the shape of the socket context
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// Create the context
const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

// Provider component
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    // Only attempt socket connection if user is authenticated
    if (!session?.user) return;

    // Create socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socket',
      auth: {
        token: session.user.email // Use email as token for now
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Socket connected');
      setSocket(newSocket as unknown as Socket);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocket(null);
      setIsConnected(false);
    });

    // Error handling
    newSocket.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
    });

    // Cleanup on unmount or session change
    return () => {
      newSocket.disconnect();
    };
  }, [session?.user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};