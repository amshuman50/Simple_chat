import { Server as HTTPServer } from 'http';
import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';
import { Socket as NetSocket } from 'net';

type ChatMessage = {
  user: string;
  message: string;
};

type NextApiResponseWithSocket = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    const io = new IOServer(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('message', (data: ChatMessage) => {
        socket.broadcast.emit('message', data); // send to others
      });
      socket.on('typing', (username: string) => {
        socket.broadcast.emit('typing', username); // send to all except sender
      });
      
    });
  }

  res.end();
}
