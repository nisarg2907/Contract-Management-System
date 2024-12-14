"use client";
import { useSocket } from "@/providers/socket";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export const SocketIndicator = () => {
  const { isConnected, socket } = useSocket();
  const [hasNewUpdates, setHasNewUpdates] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("contractUpdated", (res) => {
        console.log("res",res)
        setHasNewUpdates(true);
      });
    }

    return () => {
      if (socket) {
        socket.off("contractUpdated");
      }
    };
  }, [socket]);

  if (!isConnected) {
    return (
      <Badge 
        variant="outline" 
        className="bg-yellow-600 text-white border-none"
      >
       No New Updates
      </Badge>
    )
  }

  return (
    <Badge 
      variant="outline" 
      className={`bg-emerald-600 text-white border-none ${hasNewUpdates ? "animate-pulse" : ""}`}
    >
      {hasNewUpdates ? (
        <span className="animate-pulse">New Updates</span>
      ) : (
        <span className="dot">No New Updates</span>
      )}
    </Badge>
  )
}