import { NextResponse } from 'next/server';
import { Server } from 'socket.io';
import { getCurrentUser } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';

let io;

export async function GET(req) {
  if (!res.socket.server.io) {
    
    io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', async (socket) => {


      // Join global chat room
      socket.join('global-chat');

      // Handle new message
      socket.on('send_message', async (data) => {
        try {
          const { message, userId, userName } = data;

          // Save message to database
          await connectDB();
          const newMessage = await Message.create({
            content: message,
            sender: userId,
            senderName: userName,
            chatType: 'global',
            timestamp: new Date()
          });

          // Broadcast to all users in global chat
          io.to('global-chat').emit('receive_message', {
            id: newMessage._id.toString(),
            content: message,
            sender: {
              id: userId,
              name: userName
            },
            timestamp: newMessage.timestamp,
            isCurrentUser: false // Will be set on client side
          });

        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      // Handle user disconnect
      socket.on('disconnect', () => {
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}

export { GET as POST };
