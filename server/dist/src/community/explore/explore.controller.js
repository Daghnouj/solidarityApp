"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExploreController = void 0;
const user_model_1 = __importDefault(require("../../user/user.model"));
const conversation_model_1 = __importDefault(require("../../chat/conversation.model"));
const mongoose_1 = require("mongoose");
const community_models_1 = require("../community.models");
class ExploreController {
    static async getExploreData(req, res) {
        var _a;
        try {
            let trendingTags = await community_models_1.Hashtag.find()
                .sort({ count: -1 })
                .limit(6);
            if (trendingTags.length === 0) {
                const defaultTags = ['mentalhealth', 'support', 'wellness', 'therapy', 'community', 'solidarity'];
                await community_models_1.Hashtag.insertMany(defaultTags.map(name => ({ name, count: Math.floor(Math.random() * 100) + 10 })));
                trendingTags = await community_models_1.Hashtag.find().sort({ count: -1 }).limit(6);
            }
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            let suggestedUsers = [];
            if (userId) {
                const currentUserIdStr = userId.toString();
                const currentUser = await user_model_1.default.findById(userId).select('following').lean();
                const followingIds = ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.following) || []).map(id => id.toString());
                const myFollowers = await user_model_1.default.find({ following: userId }).select('nom following').lean();
                const suggestionsMap = new Map();
                const addSuggestion = async (followedId, suggesterName, type) => {
                    const idStr = followedId.toString();
                    if (idStr === currentUserIdStr || followingIds.includes(idStr))
                        return;
                    if (!suggestionsMap.has(idStr)) {
                        const suggestedUserInfo = await user_model_1.default.findById(followedId).select('nom photo role specialite').lean();
                        if (suggestedUserInfo) {
                            suggestionsMap.set(idStr, {
                                user: suggestedUserInfo,
                                followedBy: [{ name: suggesterName, type }],
                                mutualCount: 1
                            });
                        }
                    }
                    else {
                        const data = suggestionsMap.get(idStr);
                        if (!data.followedBy.some(fb => fb.name === suggesterName)) {
                            data.followedBy.push({ name: suggesterName, type });
                            data.mutualCount = data.followedBy.length;
                        }
                    }
                };
                const friendsFollowings = await user_model_1.default.find({ _id: { $in: followingIds } }).select('nom following').lean();
                for (const friend of friendsFollowings) {
                    if (friend.following && Array.isArray(friend.following)) {
                        for (const followedId of friend.following) {
                            await addSuggestion(followedId, friend.nom, 'following');
                        }
                    }
                }
                for (const follower of myFollowers) {
                    if (follower.following && Array.isArray(follower.following)) {
                        for (const followedId of follower.following) {
                            await addSuggestion(followedId, follower.nom, 'follower');
                        }
                    }
                }
                suggestedUsers = Array.from(suggestionsMap.values())
                    .sort((a, b) => b.mutualCount - a.mutualCount);
                if (suggestedUsers.length < 10) {
                    const existingSuggestedIds = suggestedUsers.map(s => s.user._id.toString());
                    const globalQuery = {
                        role: { $ne: 'professional' },
                        _id: { $nin: [userId, ...followingIds, ...existingSuggestedIds].filter(Boolean) },
                        isActive: true
                    };
                    const globals = await user_model_1.default.find(globalQuery)
                        .select('nom photo role specialite')
                        .limit(10 - suggestedUsers.length)
                        .lean();
                    for (const g of globals) {
                        suggestedUsers.push({
                            user: g,
                            followedBy: [],
                            mutualCount: 0
                        });
                    }
                }
                suggestedUsers = suggestedUsers.slice(0, 10);
            }
            const proQuery = { role: 'professional', isActive: true };
            if (userId)
                proQuery._id = { $ne: userId };
            const suggestedPros = await user_model_1.default.find(proQuery)
                .select('nom photo specialite bio')
                .limit(10)
                .lean();
            let followers = [];
            if (userId) {
                followers = await user_model_1.default.find({ following: userId })
                    .select('nom photo role specialite bio')
                    .limit(10)
                    .lean();
            }
            res.status(200).json({
                trendingTags,
                suggestedPros,
                suggestedUsers,
                followers
            });
        }
        catch (error) {
            console.error("Explore Data Error:", error);
            res.status(500).json({ message: error.message });
        }
    }
    static async getGroups(req, res) {
        try {
            const groups = await community_models_1.Group.find().lean();
            if (groups.length === 0) {
                const seedGroups = [
                    { name: "Youth Support", description: "A safe space for teenagers and young adults.", category: "Support" },
                    { name: "Parenting Circle", description: "Shared wisdom for raising resilient children.", category: "Family" },
                    { name: "Student Network", description: "Managing stress and academic life together.", category: "Education" },
                    { name: "Professional Growth", description: "Work-life balance and career mental health.", category: "Career" }
                ];
                await community_models_1.Group.insertMany(seedGroups);
                const newGroups = await community_models_1.Group.find().lean();
                const groupsWithCounts = await Promise.all(newGroups.map(async (group) => {
                    const count = await user_model_1.default.countDocuments({ groups: group._id });
                    return { ...group, membersCount: count };
                }));
                res.status(200).json(groupsWithCounts);
                return;
            }
            const groupsWithCounts = await Promise.all(groups.map(async (group) => {
                const count = await user_model_1.default.countDocuments({ groups: group._id });
                return { ...group, membersCount: count };
            }));
            res.status(200).json(groupsWithCounts.sort((a, b) => b.membersCount - a.membersCount));
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async getFollowers(req, res) {
        try {
            const userId = req.user._id;
            const followers = await user_model_1.default.find({ following: userId })
                .select('nom photo role specialite bio lastSeen')
                .sort({ nom: 1 })
                .lean();
            res.status(200).json(followers);
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async toggleFollow(req, res) {
        try {
            const userId = req.user._id;
            const { followId } = req.params;
            if (userId.toString() === followId) {
                res.status(400).json({ message: "You cannot follow yourself" });
                return;
            }
            const userToFollow = await user_model_1.default.findById(followId);
            if (!userToFollow) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const currentUser = await user_model_1.default.findById(userId);
            if (!currentUser) {
                res.status(404).json({ message: "Current user not found" });
                return;
            }
            const isFollowing = currentUser.following.some(id => id.toString() === followId);
            if (isFollowing) {
                currentUser.following = currentUser.following.filter(id => id.toString() !== followId);
            }
            else {
                currentUser.following.push(new mongoose_1.Types.ObjectId(followId));
            }
            await currentUser.save();
            res.status(200).json({
                success: true,
                isFollowing: !isFollowing,
                message: isFollowing ? "Unfollowed successfully" : "Followed successfully"
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async toggleGroupJoin(req, res) {
        try {
            const userId = req.user._id;
            const { groupId } = req.params;
            const group = await community_models_1.Group.findById(groupId);
            if (!group) {
                res.status(404).json({ message: "Group not found" });
                return;
            }
            const currentUser = await user_model_1.default.findById(userId);
            if (!currentUser) {
                res.status(404).json({ message: "Current user not found" });
                return;
            }
            const isMember = currentUser.groups.some(id => id.toString() === groupId);
            let conversation;
            if (isMember) {
                currentUser.groups = currentUser.groups.filter(id => id.toString() !== groupId);
                group.membersCount = Math.max(0, group.membersCount - 1);
                await conversation_model_1.default.findOneAndUpdate({ groupId: new mongoose_1.Types.ObjectId(groupId) }, { $pull: { participants: userId } });
            }
            else {
                currentUser.groups.push(new mongoose_1.Types.ObjectId(groupId));
                group.membersCount += 1;
                conversation = await conversation_model_1.default.findOneAndUpdate({ groupId: new mongoose_1.Types.ObjectId(groupId) }, {
                    $addToSet: { participants: userId },
                    $setOnInsert: {
                        isGroup: true,
                        groupName: group.name,
                        groupId: group._id
                    }
                }, { upsert: true, new: true });
            }
            await Promise.all([currentUser.save(), group.save()]);
            const io = req.app.get('io');
            const actualCount = await user_model_1.default.countDocuments({ groups: groupId });
            io.emit('group_update', { groupId, membersCount: actualCount });
            res.status(200).json({
                success: true,
                isMember: !isMember,
                conversationId: conversation === null || conversation === void 0 ? void 0 : conversation._id,
                message: isMember ? "Left group successfully" : "Joined group successfully"
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static async createGroup(req, res) {
        try {
            const userId = req.user._id;
            const { name, description, category } = req.body;
            if (!name || !description || !category) {
                res.status(400).json({ message: "Missing required fields" });
                return;
            }
            const group = new community_models_1.Group({
                name,
                description,
                category,
                membersCount: 1
            });
            await group.save();
            await user_model_1.default.findByIdAndUpdate(userId, {
                $addToSet: { groups: group._id }
            });
            const conversation = new conversation_model_1.default({
                participants: [userId],
                isGroup: true,
                groupName: name,
                groupId: group._id
            });
            await conversation.save();
            const io = req.app.get('io');
            io.emit('group_created', { group: { ...group.toObject(), membersCount: 1 } });
            res.status(201).json({
                success: true,
                group,
                conversationId: conversation._id,
                message: "Group created successfully"
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
exports.ExploreController = ExploreController;
//# sourceMappingURL=explore.controller.js.map