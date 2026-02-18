"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIOInstance = exports.setIOInstance = exports.getAdminSocketId = exports.getReceiverSocketId = exports.initSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("./user/user.model"));
const admin_model_1 = __importDefault(require("./admin/admin.model"));
const message_model_1 = __importDefault(require("./chat/message.model"));
const conversation_model_1 = __importDefault(require("./chat/conversation.model"));
const userSocketMap = {};
const adminSocketMap = {};
const initSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            const isAdmin = socket.handshake.auth.isAdmin === 'true' || socket.handshake.auth.isAdmin === true;
            if (!token) {
                console.log('❌ Socket connection rejected: No token provided');
                return next(new Error('No token provided'));
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (isAdmin) {
                    const admin = await admin_model_1.default.findById(decoded.id);
                    if (!admin) {
                        console.log(`❌ Socket connection rejected: Admin not found for ID ${decoded.id}`);
                        return next(new Error('Admin not found'));
                    }
                    socket.admin = admin;
                    console.log(`✅ Admin authenticated: ${admin.email}`);
                }
                else {
                    const user = await user_model_1.default.findById(decoded.id);
                    if (!user) {
                        console.log(`❌ Socket connection rejected: User not found for ID ${decoded.id}`);
                        return next(new Error('User not found'));
                    }
                    socket.user = user;
                    console.log(`✅ User authenticated: ${user.email}`);
                }
                next();
            }
            catch (jwtError) {
                console.log('❌ Socket connection rejected: JWT verification failed', jwtError.message);
                return next(new Error('Invalid token'));
            }
        }
        catch (error) {
            console.log('❌ Socket connection rejected: Unexpected error', error.message);
            next(new Error('Authentication failed'));
        }
    });
    io.on('connection', async (socket) => {
        if (socket.admin) {
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
        }
        else if (socket.user) {
            const userId = socket.user._id.toString();
            console.log(`✅ User ${userId} connected via socket ${socket.id}`);
            userSocketMap[userId] = socket.id;
            socket.join(userId);
            const userConversations = await conversation_model_1.default.find({ participants: userId });
            userConversations.forEach(conv => {
                socket.join(conv._id.toString());
            });
            await user_model_1.default.findByIdAndUpdate(userId, { isOnline: true });
            socket.on('edit_message', async (data) => {
                try {
                    const { messageId, content, conversationId } = data;
                    const conversation = await conversation_model_1.default.findOne({ _id: conversationId, participants: userId });
                    if (!conversation)
                        return;
                    conversation.participants.forEach((pId) => {
                        io.to(pId.toString()).emit('message_edited', { messageId, content, conversationId });
                    });
                }
                catch (error) {
                    console.error("Error in edit_message socket event:", error);
                }
            });
            socket.on('delete_message', async (data) => {
                try {
                    const { messageId, conversationId } = data;
                    const conversation = await conversation_model_1.default.findOne({ _id: conversationId, participants: userId });
                    if (!conversation)
                        return;
                    conversation.participants.forEach((pId) => {
                        io.to(pId.toString()).emit('message_deleted', { messageId, conversationId });
                    });
                }
                catch (error) {
                    console.error("Error in delete_message socket event:", error);
                }
            });
            socket.on('clear_chat', async (data) => {
                try {
                    const { conversationId } = data;
                    const conversation = await conversation_model_1.default.findOne({ _id: conversationId, participants: userId });
                    if (!conversation)
                        return;
                    io.to(userId).emit('chat_cleared', { conversationId });
                }
                catch (error) {
                    console.error("Error in clear_chat socket event:", error);
                }
            });
            socket.on('send_message', async (data) => {
                try {
                    const { receiverId, conversationId, content, attachment } = data;
                    let targetConversation;
                    if (conversationId) {
                        targetConversation = await conversation_model_1.default.findOne({ _id: conversationId, participants: userId });
                    }
                    else if (receiverId) {
                        targetConversation = await conversation_model_1.default.findOne({
                            isGroup: false,
                            participants: { $all: [userId, receiverId] }
                        });
                        if (!targetConversation) {
                            targetConversation = new conversation_model_1.default({
                                participants: [userId, receiverId],
                                isGroup: false
                            });
                            await targetConversation.save();
                        }
                    }
                    if (!targetConversation) {
                        throw new Error("Conversation not found or unauthorized");
                    }
                    const newMessage = new message_model_1.default({
                        sender: userId,
                        receiver: receiverId || (targetConversation.isGroup ? undefined : targetConversation.participants.find((p) => p.toString() !== userId.toString())),
                        conversationId: targetConversation._id,
                        content,
                        attachment
                    });
                    await newMessage.save();
                    targetConversation.lastMessage = newMessage._id;
                    await targetConversation.save();
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
                    targetConversation.participants.forEach((pId) => {
                        io.to(pId.toString()).emit('receive_message', messageData);
                    });
                }
                catch (error) {
                    console.error("Error in send_message socket event:", error);
                    socket.emit('error', { message: 'Failed to send message' });
                }
            });
            socket.on('typing', async (data) => {
                try {
                    const { conversationId } = data;
                    const conversation = await conversation_model_1.default.findOne({ _id: conversationId, participants: userId });
                    if (!conversation)
                        return;
                    const senderName = socket.user.nom;
                    conversation.participants.forEach((pId) => {
                        if (pId.toString() !== userId) {
                            io.to(pId.toString()).emit('user_typing', { conversationId, userId, userName: senderName });
                        }
                    });
                }
                catch (error) {
                    console.error("Error in typing socket event:", error);
                }
            });
            socket.on('stop_typing', async (data) => {
                try {
                    const { conversationId } = data;
                    const conversation = await conversation_model_1.default.findOne({ _id: conversationId, participants: userId });
                    if (!conversation)
                        return;
                    conversation.participants.forEach((pId) => {
                        if (pId.toString() !== userId) {
                            io.to(pId.toString()).emit('user_stop_typing', { conversationId, userId });
                        }
                    });
                }
                catch (error) {
                    console.error("Error in stop_typing socket event:", error);
                }
            });
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
                await user_model_1.default.findByIdAndUpdate(userId, { isOnline: false, lastSeen });
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
exports.initSocket = initSocket;
const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const getAdminSocketId = (adminId) => {
    return adminSocketMap[adminId];
};
exports.getAdminSocketId = getAdminSocketId;
let ioInstance = null;
const setIOInstance = (io) => {
    ioInstance = io;
};
exports.setIOInstance = setIOInstance;
const getIOInstance = () => {
    return ioInstance;
};
exports.getIOInstance = getIOInstance;
//# sourceMappingURL=socket.js.map