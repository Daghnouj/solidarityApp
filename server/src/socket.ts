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

      // Join rooms for all user conversations (private & groups)
      const userConversations = await Conversation.find({ participants: userId });
      userConversations.forEach(conv => {
        socket.join(conv._id.toString());
      });

      // Update online status
      await User.findByIdAndUpdate(userId, { isOnline: true });

      // --- Messaging Events ---
      socket.on('edit_message', async (data: { messageId: string, content: string, conversationId: string }) => {
        try {
          const { messageId, content, conversationId } = data;

          // Verify participant
          const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
          if (!conversation) return;

          // Broadcast to all participants in their own rooms
          conversation.participants.forEach((pId: any) => {
            io.to(pId.toString()).emit('message_edited', { messageId, content, conversationId });
          });
        } catch (error) {
          console.error("Error in edit_message socket event:", error);
        }
      });

      socket.on('delete_message', async (data: { messageId: string, conversationId: string }) => {
        try {
          const { messageId, conversationId } = data;

          // Verify participant
          const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
          if (!conversation) return;

          conversation.participants.forEach((pId: any) => {
            io.to(pId.toString()).emit('message_deleted', { messageId, conversationId });
          });
        } catch (error) {
          console.error("Error in delete_message socket event:", error);
        }
      });

      socket.on('clear_chat', async (data: { conversationId: string }) => {
        try {
          const { conversationId } = data;

          // Verify participant
          const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
          if (!conversation) return;

          io.to(userId).emit('chat_cleared', { conversationId });
        } catch (error) {
          console.error("Error in clear_chat socket event:", error);
        }
      });

      socket.on('send_message', async (data: { receiverId?: string, conversationId?: string, content: string, attachment?: any }) => {
        try {
          const { receiverId, conversationId, content, attachment } = data;

          let targetConversation;

          if (conversationId) {
            targetConversation = await Conversation.findOne({ _id: conversationId, participants: userId });
          } else if (receiverId) {
            targetConversation = await Conversation.findOne({
              isGroup: false,
              participants: { $all: [userId, receiverId] }
            });

            if (!targetConversation) {
              targetConversation = new Conversation({
                participants: [userId, receiverId],
                isGroup: false
              });
              await targetConversation.save();
            }
          }

          if (!targetConversation) {
            throw new Error("Conversation not found or unauthorized");
          }

          const newMessage = new Message({
            sender: userId,
            conversationId: targetConversation._id,
            content,
            attachment
          });
          await newMessage.save();

          targetConversation.lastMessage = newMessage._id as any;
          await targetConversation.save();

          // Broadcast to ALL participants via their private rooms (multi-tab sync)
          const messageData = {
            _id: newMessage._id,
            sender: userId,
            conversationId: targetConversation._id,
            content: newMessage.content,
            attachment: newMessage.attachment,
            timestamp: newMessage.timestamp,
            read: newMessage.read,
            isGroup: targetConversation.isGroup,
            groupName: targetConversation.groupName
          };

          targetConversation.participants.forEach((pId: any) => {
            io.to(pId.toString()).emit('receive_message', messageData);
          });

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