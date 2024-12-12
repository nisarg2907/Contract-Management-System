import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// Socket server configuration
export function configureSocketServer(server: HTTPServer) {
  const io = new Server(server, {
    path: '/api/socket',
    cors: {
      origin: [
        'http://localhost:3000', 
        process.env.NEXT_PUBLIC_APP_URL || ''
      ],
      methods: ['GET', 'POST']
    }
  });

  // Socket connection handler
  io.on('connection', (socket) => {
    console.log('A user connected');

    // Contract-related events
    socket.on('contract:create', async (contractData) => {
      try {
        // Broadcast to all connected clients
        io.emit('contract:created', contractData);
      } catch (error) {
        console.error('Contract creation error:', error);
      }
    });

    socket.on('contract:update', async (contractData) => {
      try {
        io.emit('contract:updated', contractData);
      } catch (error) {
        console.error('Contract update error:', error);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  return io;
}