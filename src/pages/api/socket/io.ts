import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Socket } from "net";

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path,
    });
    res.socket.server.io = io;
    (globalThis as unknown as { io: ServerIO }).io = io;
    console.log("Socket.IO server initialized",globalThis);
  } else {
    console.log("Socket.IO server already initialized");
  }

  res.end();
};

export default ioHandler;
