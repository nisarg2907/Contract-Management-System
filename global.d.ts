import { Server as SocketIOServer } from "socket.io";

declare global {
  interface Global {
    io?: SocketIOServer;
  }
}
