import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import User from './user/user.model';

const userSocketMap: { [userId: string]: string } = {};

interface SocketWithUser extends Socket {
  user?: any;
}

export const initSocket = (io: Server): void => {
  io.use(async (socket: SocketWithUser, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) throw new Error('Auth error');

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      const user = await User.findById(decoded.id);
      if (!user) throw new Error('User not found');
 
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: SocketWithUser) => {
    if (!socket.user) return;

    const userId = socket.user._id.toString();
    console.log(`✅ User ${userId} connected via socket ${socket.id}`);

    userSocketMap[userId] = socket.id;
    socket.join(userId);

    io.emit('presenceUpdate', { 
      userId,
      isOnline: true 
    });
    io.emit('onlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected`);
      delete userSocketMap[userId];
      socket.leave(userId);
      
      io.emit('presenceUpdate', { 
        userId,
        isOnline: false 
      });
      io.emit('onlineUsers', Object.keys(userSocketMap));
    });
  });
};

export const getReceiverSocketId = (userId: string): string | undefined => {
  return userSocketMap[userId];
};