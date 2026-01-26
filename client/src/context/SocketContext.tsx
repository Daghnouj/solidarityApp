import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../redux/hooks';

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const { user } = useAppSelector((state) => state.auth);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token && user) {
            const socketInstance = io(import.meta.env.VITE_API_URL.replace('/api', ''), {
                auth: { token },
                transports: ['websocket'],
            });

            setSocket(socketInstance);

            socketInstance.on('onlineUsers', (users: string[]) => {
                setOnlineUsers(users);
            });

            socketInstance.on('presenceUpdate', (data: { userId: string, isOnline: boolean }) => {
                setOnlineUsers(prev => {
                    if (data.isOnline) {
                        return prev.includes(data.userId) ? prev : [...prev, data.userId];
                    } else {
                        return prev.filter(id => id !== data.userId);
                    }
                });
            });

            return () => {
                socketInstance.disconnect();
                setSocket(null);
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [token, user?._id]);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
