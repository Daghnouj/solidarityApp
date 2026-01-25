import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import User from './user/user.model';
import Admin from './admin/admin.model';
import Message from './chat/message.model';
import Conversation from './chat/conversation.model';

const userSocketMap: { [userId: string]: string } = {};
const adminSocketMap: { [adminId: string]: string } = {};

interface SocketWithUser extends Socket {
  user?: any;
  admin?: any;
}

export const initSocket = (io: Server): void => {
  io.use(async (socket: SocketWithUser, next) => {
    try {
      const token = socket.handshake.auth.token;
      const isAdmin = socket.handshake.auth.isAdmin === 'true' || socket.handshake.auth.isAdmin === true;

      if (!token) {
        console.log('❌ Socket connection rejected: No token provided');
        return next(new Error('No token provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;

        if (isAdmin) {
          // Admin authentication
          const admin = await Admin.findById(decoded.id);
          if (!admin) {
            console.log(`❌ Socket connection rejected: Admin not found for ID ${decoded.id}`);
            return next(new Error('Admin not found'));
          }
          socket.admin = admin;
          console.log(`✅ Admin authenticated: ${admin.email}`);
        } else {
          // User authentication
          const user = await User.findById(decoded.id);
          if (!user) {
            console.log(`❌ Socket connection rejected: User not found for ID ${decoded.id}`);
            return next(new Error('User not found'));
          }
          socket.user = user;
          console.log(`✅ User authenticated: ${user.email}`);
        }

        next();
      } catch (jwtError: any) {
        console.log('❌ Socket connection rejected: JWT verification failed', jwtError.message);
        return next(new Error('Invalid token'));
      }
    } catch (error: any) {
      console.log('❌ Socket connection rejected: Unexpected error', error.message);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket: SocketWithUser) => {
    if (socket.admin) {
      // Admin connection
      const adminId = socket.admin._id.toString();
      console.log(`✅ Admin ${adminId} connected via socket ${socket.id}`);

      adminSocketMap[adminId] = socket.id;
      socket.join('admin-room');
      socket.join(`admin-${adminId}`);

      socket.on('disconnect', () => {
        console.log(`❌ Admin ${adminId} disconnected`);
        delete adminSocketMap[adminId];
        socket.leave('admin-room');
        socket.leave(`admin-${adminId}`);
      });

    } else if (socket.user) {
      // User connection
      const userId = socket.user._id.toString();
      console.log(`✅ User ${userId} connected via socket ${socket.id}`);

      userSocketMap[userId] = socket.id;
      socket.join(userId);

      // Update online status
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // --- Private Messaging Events ---
      socket.on('edit_message', async (data: { messageId: string, content: string, receiverId: string }) => {
        try {
          const { messageId, content, receiverId } = data;
          io.to(receiverId).emit('message_edited', { messageId, content });
          socket.emit('message_edited', { messageId, content });
        } catch (error) {
          console.error("Error in edit_message socket event:", error);
        }
      });

      socket.on('delete_message', async (data: { messageId: string, receiverId: string }) => {
        try {
          const { messageId, receiverId } = data;
          io.to(receiverId).emit('message_deleted', { messageId });
          socket.emit('message_deleted', { messageId });
        } catch (error) {
          console.error("Error in delete_message socket event:", error);
        }
      });

      socket.on('clear_chat', async (data: { receiverId: string }) => {
        try {
          const { receiverId } = data;
          io.to(receiverId).emit('chat_cleared', { senderId: userId });
          socket.emit('chat_cleared', { senderId: receiverId });
        } catch (error) {
          console.error("Error in clear_chat socket event:", error);
        }
      });

      socket.on('send_message', async (data: { receiverId: string, content: string, attachment?: any }) => {
        try {
          const { receiverId, content, attachment } = data;

          // 1. Create and save message
          const newMessage = new Message({
            sender: userId,
            receiver: receiverId,
            content,
            attachment
          });
          await newMessage.save();

          // 2. Find or create conversation
          let conversation = await Conversation.findOne({
            participants: { $all: [userId, receiverId] }
          });

          if (!conversation) {
            conversation = new Conversation({
              participants: [userId, receiverId]
            });
          }

          conversation.lastMessage = newMessage._id as any;
          await conversation.save();

          // 3. Emit to receiver room if they are online
          io.to(receiverId).emit('receive_message', {
            _id: newMessage._id,
            sender: userId,
            receiver: receiverId,
            content: newMessage.content,
            attachment: newMessage.attachment,
            timestamp: newMessage.timestamp,
            read: newMessage.read
          });

          // 4. Acknowledge to sender
          socket.emit('message_sent', newMessage);

        } catch (error) {
          console.error("Error in send_message socket event:", error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });
      // --------------------------------

      io.emit('presenceUpdate', {
        userId,
        isOnline: true
      });
      io.emit('onlineUsers', Object.keys(userSocketMap));

      socket.on('disconnect', async () => {
        console.log(`❌ User ${userId} disconnected`);
        delete userSocketMap[userId];
        socket.leave(userId);

        const lastSeen = new Date();
        // Update database
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen });

        io.emit('presenceUpdate', {
          userId,
          isOnline: false,
          lastSeen
        });
        io.emit('onlineUsers', Object.keys(userSocketMap));
      });
    }
  });
};

export const getReceiverSocketId = (userId: string): string | undefined => {
  return userSocketMap[userId];
};

export const getAdminSocketId = (adminId: string): string | undefined => {
  return adminSocketMap[adminId];
};

// Export io instance getter (will be set by server.ts)
let ioInstance: Server | null = null;

export const setIOInstance = (io: Server): void => {
  ioInstance = io;
};

export const getIOInstance = (): Server | null => {
  return ioInstance;
};