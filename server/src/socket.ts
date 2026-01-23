import jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import User from './user/user.model';
import Admin from './admin/admin.model';

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

  io.on('connection', (socket: SocketWithUser) => {
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