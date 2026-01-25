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
            .populate('lastMessage')
            .sort({ updatedAt: -1 });

        res.status(200).json(conversations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user._id;
        const { otherUserId } = req.params;

        // Find message history between current user and other user
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json(messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableContacts = async (req: ProtectedRequest, res: Response): Promise<void> => {
    try {
        // For now, return all users except self, or could filter by role (e.g. patients see professionals)
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('nom photo email role lastSeen')
            .limit(20);

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
        const { otherUserId } = req.params;

        // Delete all messages between these two users
        await Message.deleteMany({
            $or: [
                { sender: userId, receiver: otherUserId },
                { sender: otherUserId, receiver: userId }
            ]
        });

        // Update conversation
        await Conversation.findOneAndUpdate(
            { participants: { $all: [userId, otherUserId] } },
            { $unset: { lastMessage: "" } }
        );

        res.status(200).json({ message: "Conversation effacée" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
