"use client";
import { useSocket } from "@/providers/socket";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useUserStatuses } from "@/hooks/use-user-statuses";
import { ContractStatus } from "@prisma/client";

interface ContractUpdate {
  id: string;
  status: ContractStatus;
}

export const SocketIndicator = () => {
  const { isConnected, socket } = useSocket();
  const [newUpdatesCount, setNewUpdatesCount] = useState(() => {
    const storedCount = localStorage.getItem('newUpdatesCount');
    return storedCount ? parseInt(storedCount, 10) : 0;
  });
  const { statuses } = useUserStatuses();

  useEffect(() => {
    if (socket) {
      socket.on("contractUpdated", async (res: ContractUpdate) => {
        if (statuses.includes(res.status)) {
          const newCount = Math.min((newUpdatesCount || 0) + 1, 9);
          setNewUpdatesCount(newCount);
          localStorage.setItem('newUpdatesCount', newCount.toString());
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("contractUpdated");
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, statuses]);

  const clearUpdates = () => {
    setNewUpdatesCount(0);
    localStorage.removeItem('newUpdatesCount');
  };

  if (!isConnected || newUpdatesCount === 0) {
    return null;
  }

  return (
    <Badge 
      variant="destructive"
      className="animate-pulse ml-2"
      onClick={clearUpdates}
    >
      {newUpdatesCount === 9 ? '9+' : newUpdatesCount}
    </Badge>
  );
}