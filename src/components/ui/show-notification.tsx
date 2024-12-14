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
    return <></>
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
  )
}