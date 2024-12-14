import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState<typeof Socket | null>(null);

  useEffect(() => {
    const initSocket = async () => {
      const socketIO = await import("socket.io-client");
      
      const socketInstance = socketIO.default("/api/socket", {
        path: "/api/socket"
      });

      setSocket(socketInstance);
      return () => {
        socketInstance.disconnect();
      };
    };

    const cleanupPromise = initSocket();
    return () => {
      cleanupPromise.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, []);

  return { socket };
};

export default useSocket;