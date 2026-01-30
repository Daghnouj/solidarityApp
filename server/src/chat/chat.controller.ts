import { Response } from 'express';
import { ProtectedRequest } from '../types/express';
import Message from './message.model';
import Conversation from './conversation.model';
import User from '../user/user.model';

export const getConversations = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'nom photo email role lastSeen')
            .populate({
                path: 'lastMessage',
                match: { deletedBy: { $ne: userId } } // Only populate if not deleted by user
            })
            .sort({ updatedAt: -1 });

        // Calculate unread count for each conversation
        const conversationsWithCount = await Promise.all(conversations.map(async (conv: any) => {
            const unreadCount = await Message.countDocuments({
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
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;
        const { conversationId } = req.params;

        // Check if user is participant
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId
        });

        if (!conversation) {
            res.status(403).json({ message: "Non autorisé ou conversation introuvable" });
            return;
        }

        const messages = await Message.find({
            conversationId,
            deletedBy: { $ne: userId } // Exclude messages deleted by this user
        })
            .populate('sender', 'nom photo role')
            .populate('readBy', 'nom photo')
            .sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableContacts = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;

        // Fetch current user with their following list
        const currentUser = await User.findById(userId).select('following');
        if (!currentUser) {
            res.status(404).json({ message: "Utilisateur introuvable" });
            return;
        }

        // Return users that the current user is following
        const users = await User.find({
            _id: { $in: currentUser.following }
        })
            .select('nom photo email role lastSeen')
            .limit(50);

        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const editMessage = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
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
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMessage = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            res.status(404).json({ message: "Message introuvable" });
            return;
        }

        if (message.sender.toString() !== userId.toString()) {
            res.status(403).json({ message: "Non autorisé" });
            return;
        }

        await Message.findByIdAndDelete(messageId);

        // Update conversation lastMessage if needed
        await Conversation.updateMany(
            { lastMessage: messageId },
            { $unset: { lastMessage: "" } }
        );

        res.status(200).json({ message: "Message supprimé" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const clearConversation = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;
        const { conversationId } = req.params;

        // Soft delete: Add user to deletedBy array for all messages in this conversation
        await Message.updateMany(
            { conversationId: conversationId },
            { $addToSet: { deletedBy: userId } }
        );

        // Update conversation to clear last message ONLY if both deleted (optional, or just leave it)
        // For now, we won't unset the last message reference entirely as the other user might still see it.
        // A more advanced approach would be to check if both deleted, but for simplicity we keep it.

        res.status(200).json({ message: "Conversation cleared successfully" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const markMessagesAsRead = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;
        const { conversationId } = req.params;

        const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
        if (!conversation) {
            res.status(403).json({ message: "Non autorisé" });
            return;
        }

        const query: any = {
            conversationId,
            readBy: { $ne: userId },
            sender: { $ne: userId }
        };

        await Message.updateMany(query, {
            $addToSet: { readBy: userId },
            $set: { read: true } // Keep this for now for legacy/simple checks
        });

        // Real-time update via socket - Emit to each participant's room
        const io = req.app.get('io');
        if (io) {
            conversation.participants.forEach((pId: any) => {
                io.to(pId.toString()).emit('messages_read', { conversationId, readerId: userId });
            });
        }

        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
