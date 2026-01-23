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
      
      if (!token) throw new Error('Auth error');

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      
      if (isAdmin) {
        // Admin authentication
        const admin = await Admin.findById(decoded.id);
        if (!admin) throw new Error('Admin not found');
        socket.admin = admin;
      } else {
        // User authentication
        const user = await User.findById(decoded.id);
        if (!user) throw new Error('User not found');
        socket.user = user;
      }
      
      next();
    } catch (error) {
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