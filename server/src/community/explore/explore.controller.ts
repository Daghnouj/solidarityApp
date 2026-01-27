import { Request, Response } from 'express';
import User from '../../user/user.model';
import Conversation from '../../chat/conversation.model';
import { ProtectedRequest } from '../../types/express';
import { Types } from 'mongoose';
import { Hashtag, Group } from '../community.models';

export class ExploreController {
    static async getExploreData(req: Request, res: Response): Promise<void> {
        try {
            // 1. Trending Tags with fallback seeding
            let trendingTags = await Hashtag.find()
                .sort({ count: -1 })
                .limit(6);

            if (trendingTags.length === 0) {
                const defaultTags = ['mentalhealth', 'support', 'wellness', 'therapy', 'community', 'solidarity'];
                await Hashtag.insertMany(defaultTags.map(name => ({ name, count: Math.floor(Math.random() * 100) + 10 })));
                trendingTags = await Hashtag.find().sort({ count: -1 }).limit(6);
            }

            const userId = (req as any).user?._id;
            let suggestedUsers: any[] = [];

            if (userId) {
                const currentUserIdStr = userId.toString();
                const currentUser = await User.findById(userId).select('following').lean();
                const followingIds = (currentUser?.following || []).map(id => id.toString());

                const myFollowers = await User.find({ following: userId }).select('nom following').lean();
                const suggestionsMap: Map<string, { user: any, followedBy: { name: string, type: 'following' | 'follower' }[], mutualCount: number }> = new Map();

                const addSuggestion = async (followedId: any, suggesterName: string, type: 'following' | 'follower') => {
                    const idStr = followedId.toString();
                    if (idStr === currentUserIdStr || followingIds.includes(idStr)) return;

                    if (!suggestionsMap.has(idStr)) {
                        const suggestedUserInfo = await User.findById(followedId).select('nom photo role specialite').lean();
                        if (suggestedUserInfo) {
                            suggestionsMap.set(idStr, {
                                user: suggestedUserInfo,
                                followedBy: [{ name: suggesterName, type }],
                                mutualCount: 1
                            });
                        }
                    } else {
                        const data = suggestionsMap.get(idStr)!;
                        if (!data.followedBy.some(fb => fb.name === suggesterName)) {
                            data.followedBy.push({ name: suggesterName, type });
                            data.mutualCount = data.followedBy.length;
                        }
                    }
                };

                // Suggestions from people I FOLLOW (Mutual Connections)
                const friendsFollowings = await User.find({ _id: { $in: followingIds } }).select('nom following').lean();
                for (const friend of friendsFollowings) {
                    if (friend.following && Array.isArray(friend.following)) {
                        for (const followedId of friend.following) {
                            await addSuggestion(followedId, friend.nom, 'following');
                        }
                    }
                }

                // Suggestions from people who FOLLOW ME
                for (const follower of myFollowers) {
                    if (follower.following && Array.isArray(follower.following)) {
                        for (const followedId of follower.following) {
                            await addSuggestion(followedId, (follower as any).nom, 'follower');
                        }
                    }
                }

                suggestedUsers = Array.from(suggestionsMap.values())
                    .sort((a, b) => b.mutualCount - a.mutualCount);

                // 4. Supplement with Global Suggestions if few (to ensure the list isn't empty)
                if (suggestedUsers.length < 10) {
                    const existingSuggestedIds = suggestedUsers.map(s => s.user._id.toString());
                    const globalQuery: any = {
                        role: { $ne: 'professional' },
                        _id: { $nin: [userId, ...followingIds, ...existingSuggestedIds].filter(Boolean) },
                        isActive: true
                    };

                    const globals = await User.find(globalQuery)
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

            // Get suggested professionals (simple list)
            const proQuery: any = { role: 'professional', isActive: true };
            if (userId) proQuery._id = { $ne: userId };

            const suggestedPros = await User.find(proQuery)
                .select('nom photo specialite bio')
                .limit(10)
                .lean();

            // 5. Get My Followers (NEW)
            let followers: any[] = [];
            if (userId) {
                followers = await User.find({ following: userId })
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
        } catch (error: any) {
            console.error("Explore Data Error:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async getGroups(req: Request, res: Response): Promise<void> {
        try {
            // First, count actual members for each group
            const groups = await Group.find().lean();

            if (groups.length === 0) {
                const seedGroups = [
                    { name: "Youth Support", description: "A safe space for teenagers and young adults.", category: "Support" },
                    { name: "Parenting Circle", description: "Shared wisdom for raising resilient children.", category: "Family" },
                    { name: "Student Network", description: "Managing stress and academic life together.", category: "Education" },
                    { name: "Professional Growth", description: "Work-life balance and career mental health.", category: "Career" }
                ];
                await Group.insertMany(seedGroups);
                const newGroups = await Group.find().lean();

                // Calculate actual counts for new groups
                const groupsWithCounts = await Promise.all(newGroups.map(async (group) => {
                    const count = await User.countDocuments({ groups: group._id });
                    return { ...group, membersCount: count };
                }));

                res.status(200).json(groupsWithCounts);
                return;
            }

            const groupsWithCounts = await Promise.all(groups.map(async (group) => {
                const count = await User.countDocuments({ groups: group._id });
                return { ...group, membersCount: count };
            }));

            res.status(200).json(groupsWithCounts.sort((a, b) => b.membersCount - a.membersCount));
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getFollowers(req: ProtectedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user._id;
            const followers = await User.find({ following: userId })
                .select('nom photo role specialite bio lastSeen')
                .sort({ nom: 1 })
                .lean();

            res.status(200).json(followers);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async toggleFollow(req: ProtectedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user._id;
            const { followId } = req.params;

            if (userId.toString() === followId) {
                res.status(400).json({ message: "You cannot follow yourself" });
                return;
            }

            const userToFollow = await User.findById(followId);
            if (!userToFollow) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            const currentUser = await User.findById(userId);
            if (!currentUser) {
                res.status(404).json({ message: "Current user not found" });
                return;
            }

            const isFollowing = currentUser.following.some(id => id.toString() === followId);

            if (isFollowing) {
                // Unfollow
                currentUser.following = currentUser.following.filter(id => id.toString() !== followId);
            } else {
                // Follow
                currentUser.following.push(new Types.ObjectId(followId));
            }

            await currentUser.save();

            res.status(200).json({
                success: true,
                isFollowing: !isFollowing,
                message: isFollowing ? "Unfollowed successfully" : "Followed successfully"
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async toggleGroupJoin(req: ProtectedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user._id;
            const { groupId } = req.params;

            const group = await Group.findById(groupId);
            if (!group) {
                res.status(404).json({ message: "Group not found" });
                return;
            }

            const currentUser = await User.findById(userId);
            if (!currentUser) {
                res.status(404).json({ message: "Current user not found" });
                return;
            }

            const isMember = currentUser.groups.some(id => id.toString() === groupId);
            let conversation;

            if (isMember) {
                // Leave
                currentUser.groups = currentUser.groups.filter(id => id.toString() !== groupId);
                group.membersCount = Math.max(0, group.membersCount - 1);

                // Update Group Conversation
                await Conversation.findOneAndUpdate(
                    { groupId: new Types.ObjectId(groupId) },
                    { $pull: { participants: userId } }
                );
            } else {
                // Join
                currentUser.groups.push(new Types.ObjectId(groupId));
                group.membersCount += 1;

                // Update or Create Group Conversation
                conversation = await Conversation.findOneAndUpdate(
                    { groupId: new Types.ObjectId(groupId) },
                    {
                        $addToSet: { participants: userId },
                        $setOnInsert: {
                            isGroup: true,
                            groupName: group.name,
                            groupId: group._id
                        }
                    },
                    { upsert: true, new: true }
                );
            }

            await Promise.all([currentUser.save(), group.save()]);

            // Real-time update via Socket.IO
            const io = req.app.get('io');
            const actualCount = await User.countDocuments({ groups: groupId });
            io.emit('group_update', { groupId, membersCount: actualCount });

            res.status(200).json({
                success: true,
                isMember: !isMember,
                conversationId: conversation?._id,
                message: isMember ? "Left group successfully" : "Joined group successfully"
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createGroup(req: ProtectedRequest, res: Response): Promise<void> {
        try {
            const userId = req.user._id;
            const { name, description, category } = req.body;

            if (!name || !description || !category) {
                res.status(400).json({ message: "Missing required fields" });
                return;
            }

            // Create Group
            const group = new Group({
                name,
                description,
                category,
                membersCount: 1 // Creator is first member
            });
            await group.save();

            // Add to User's groups
            await User.findByIdAndUpdate(userId, {
                $addToSet: { groups: group._id }
            });

            // Create Group Conversation
            const conversation = new Conversation({
                participants: [userId],
                isGroup: true,
                groupName: name,
                groupId: group._id
            });
            await conversation.save();

            // Real-time update via Socket.IO
            const io = req.app.get('io');
            io.emit('group_created', { group: { ...group.toObject(), membersCount: 1 } });

            res.status(201).json({
                success: true,
                group,
                conversationId: conversation._id,
                message: "Group created successfully"
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
