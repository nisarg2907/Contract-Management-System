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
  const [hasNewUpdates, setHasNewUpdates] = useState(false);
  const { statuses } = useUserStatuses();

  useEffect(() => {
    if (socket) {
      socket.on("contractUpdated", async (res: ContractUpdate) => {
        const updatedStatuses = statuses.includes(res.status)
        setHasNewUpdates(updatedStatuses);
      });
    }

    return () => {
      if (socket) {
        socket.off("contractUpdated");
      }
    };
  }, [socket, statuses]);

  if (!isConnected) {
    return <></>;
  }

  return (
    hasNewUpdates && (
      <Badge 
        variant="outline" 
        className={`bg-emerald-600 text-white border-none ${hasNewUpdates ? "animate-pulse" : ""}`}
      >
        <span className="animate-pulse">New Updates</span>
      </Badge>
    )
  );
}