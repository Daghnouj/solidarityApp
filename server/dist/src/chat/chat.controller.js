"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markMessagesAsRead = exports.clearConversation = exports.deleteMessage = exports.editMessage = exports.getAvailableContacts = exports.getMessages = exports.getConversations = void 0;
const message_model_1 = __importDefault(require("./message.model"));
const conversation_model_1 = __importDefault(require("./conversation.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await conversation_model_1.default.find({
            participants: userId
        })
            .populate('participants', 'nom photo email role lastSeen')
            .populate({
            path: 'lastMessage',
            match: { deletedBy: { $ne: userId } }
        })
            .sort({ updatedAt: -1 });
        const conversationsWithCount = await Promise.all(conversations.map(async (conv) => {
            const unreadCount = await message_model_1.default.countDocuments({
                conversationId: conv._id,
                read: false,
                sender: { $ne: userId }
            });
            return {
                ...conv.toObject(),
                unreadCount
            };
        }));
        res.status(200).json(conversationsWithCount);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getConversations = getConversations;
const getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        const { conversationId } = req.params;
        const conversation = await conversation_model_1.default.findOne({
            _id: conversationId,
            participants: userId
        });
        if (!conversation) {
            res.status(403).json({ message: "Non autorisé ou conversation introuvable" });
            return;
        }
        const messages = await message_model_1.default.find({
            conversationId,
            deletedBy: { $ne: userId }
        })
            .populate('sender', 'nom photo role')
            .populate('readBy', 'nom photo')
            .sort({ timestamp: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMessages = getMessages;
const getAvailableContacts = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentUser = await user_model_1.default.findById(userId).select('following');
        if (!currentUser) {
            res.status(404).json({ message: "Utilisateur introuvable" });
            return;
        }
        const users = await user_model_1.default.find({
            _id: { $in: currentUser.following }
        })
            .select('nom photo email role lastSeen')
            .limit(50);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAvailableContacts = getAvailableContacts;
const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;
        const message = await message_model_1.default.findById(messageId);
        if (!message) {
            res.status(404).json({ message: "Message introuvable" });
            return;
        }
        if (message.sender.toString() !== userId.toString()) {
            res.status(403).json({ message: "Non autorisé" });
            return;
        }
        message.content = content;
        await message.save();
        res.status(200).json(message);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.editMessage = editMessage;
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;
        const message = await message_model_1.default.findById(messageId);
        if (!message) {
            res.status(404).json({ message: "Message introuvable" });
            return;
        }
        if (message.sender.toString() !== userId.toString()) {
            res.status(403).json({ message: "Non autorisé" });
            return;
        }
        await message_model_1.default.findByIdAndDelete(messageId);
        await conversation_model_1.default.updateMany({ lastMessage: messageId }, { $unset: { lastMessage: "" } });
        res.status(200).json({ message: "Message supprimé" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteMessage = deleteMessage;
const clearConversation = async (req, res) => {
    try {
        const userId = req.user._id;
        const { conversationId } = req.params;
        await message_model_1.default.updateMany({ conversationId: conversationId }, { $addToSet: { deletedBy: userId } });
        res.status(200).json({ message: "Conversation cleared successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.clearConversation = clearConversation;
const markMessagesAsRead = async (req, res) => {
    try {
        const userId = req.user._id;
        const { conversationId } = req.params;
        const conversation = await conversation_model_1.default.findOne({ _id: conversationId, participants: userId });
        if (!conversation) {
            res.status(403).json({ message: "Non autorisé" });
            return;
        }
        const query = {
            conversationId,
            readBy: { $ne: userId },
            sender: { $ne: userId }
        };
        await message_model_1.default.updateMany(query, {
            $addToSet: { readBy: userId },
            $set: { read: true }
        });
        const io = req.app.get('io');
        if (io) {
            conversation.participants.forEach((pId) => {
                io.to(pId.toString()).emit('messages_read', { conversationId, readerId: userId });
            });
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markMessagesAsRead = markMessagesAsRead;
//# sourceMappingURL=chat.controller.js.map