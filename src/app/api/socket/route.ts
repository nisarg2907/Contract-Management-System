import { Server } from "socket.io";
import { NextRequest, NextResponse } from "next/server";

let io: Server | null = null;

export async function GET(_request: NextRequest) {
  // Check if socket is already initialized
  console.log("request",_request)
  if (io) {
    return NextResponse.json({ message: "Socket already initialized" });
  }

  try {
    // Import http server dynamically to avoid SSR issues
    const { createServer } = await import("http");
    const httpServer = createServer();
    
    // Initialize Socket.IO
    io = new Server(httpServer, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:3001",
        ],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
      }
    });

    // Setup socket event listeners
    io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("join_room", (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room ${roomName}`);
      });

      socket.on("leave_room", (roomName) => {
        socket.leave(roomName);
        console.log(`User ${socket.id} left room ${roomName}`);
      });

      socket.on("custom_event", (data) => {
        io?.emit("event_response", { 
          message: "Event received", 
          data 
        });
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    return NextResponse.json({ 
      message: "Socket.IO initialized successfully" 
    });
  } catch (error) {
    console.error("Socket.IO initialization error:", error);
    return NextResponse.json({ 
      error: "Failed to initialize Socket.IO", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}