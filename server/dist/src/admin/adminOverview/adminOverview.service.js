"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOverviewService = void 0;
const admin_model_1 = require("../admin.model");
const post_model_1 = __importDefault(require("../../community/post/post.model"));
const user_model_1 = __importDefault(require("../../user/user.model"));
const event_model_1 = require("../../event/event.model");
const gallery_model_1 = __importDefault(require("../../gallery/gallery.model"));
const contact_model_1 = __importDefault(require("../../contact/contact.model"));
const partners_model_1 = require("../../partners/partners.model");
const request_model_1 = __importDefault(require("../../request/request.model"));
class AdminOverviewService {
    static async getOverviewData() {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        const [totalUsers, totalPatients, totalProfessionals, totalPosts, totalEvents, totalGalleryItems, totalContacts, totalPartners, totalRequests, totalAdmins] = await Promise.all([
            user_model_1.default.countDocuments(),
            user_model_1.default.countDocuments({ role: 'patient' }),
            user_model_1.default.countDocuments({ role: 'professional' }),
            post_model_1.default.countDocuments(),
            event_model_1.Event.countDocuments(),
            gallery_model_1.default.countDocuments(),
            contact_model_1.default.countDocuments(),
            partners_model_1.Partenaire.countDocuments(),
            request_model_1.default.countDocuments(),
            admin_model_1.Admin.countDocuments()
        ]);
        const commentsAggregation = await post_model_1.default.aggregate([
            { $unwind: '$comments' },
            { $count: 'totalComments' },
        ]);
        const totalComments = commentsAggregation.length > 0 ? commentsAggregation[0].totalComments : 0;
        const likesAggregation = await post_model_1.default.aggregate([
            { $project: { _id: 0, likes: { $size: '$likedBy' } } },
            { $group: { _id: null, totalLikes: { $sum: '$likes' } } },
        ]);
        const totalLikes = likesAggregation.length > 0 ? likesAggregation[0].totalLikes : 0;
        const verificationStats = {
            pending: await user_model_1.default.countDocuments({ verification_status: 'pending' }),
            approved: await user_model_1.default.countDocuments({ verification_status: 'approved' }),
            rejected: await user_model_1.default.countDocuments({ verification_status: 'rejected' }),
        };
        const activeUsers = {
            online: await user_model_1.default.countDocuments({ isOnline: true }),
            offline: await user_model_1.default.countDocuments({ isOnline: false }),
            newThisWeek: await user_model_1.default.countDocuments({ createdAt: { $gte: startOfWeek } }),
            newThisMonth: await user_model_1.default.countDocuments({ createdAt: { $gte: startOfMonth } }),
        };
        const hashtagsAggregation = await post_model_1.default.aggregate([
            { $unwind: '$hashtags' },
            { $group: { _id: '$hashtags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);
        const topHashtags = hashtagsAggregation.map(item => ({
            hashtag: item._id,
            count: item.count,
        }));
        const uniqueHashtags = await post_model_1.default.aggregate([
            { $unwind: '$hashtags' },
            { $group: { _id: '$hashtags' } },
            { $count: 'total' },
        ]);
        const totalHashtags = uniqueHashtags.length > 0 ? uniqueHashtags[0].total : 0;
        const postsStats = {
            totalHashtags,
            topHashtags,
            postsThisWeek: await post_model_1.default.countDocuments({ createdAt: { $gte: startOfWeek } }),
            postsThisMonth: await post_model_1.default.countDocuments({ createdAt: { $gte: startOfMonth } }),
        };
        const galleryViewsAggregation = await gallery_model_1.default.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } },
        ]);
        const totalViews = galleryViewsAggregation.length > 0 ? galleryViewsAggregation[0].totalViews : 0;
        const galleryByCategory = await gallery_model_1.default.aggregate([
            {
                $group: {
                    _id: '$categorie',
                    count: { $sum: 1 },
                    views: { $sum: '$views' },
                },
            },
            { $sort: { count: -1 } },
        ]);
        const byCategory = galleryByCategory.map(item => ({
            category: item._id,
            count: item.count,
            views: item.views,
        }));
        const galleryStats = {
            totalViews,
            byCategory,
        };
        const mostActiveUsers = await user_model_1.default.aggregate([
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'posts',
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    let: { userId: '$_id' },
                    pipeline: [
                        { $unwind: '$comments' },
                        { $match: { $expr: { $eq: ['$comments.user', '$$userId'] } } },
                    ],
                    as: 'comments',
                },
            },
            {
                $lookup: {
                    from: 'posts',
                    let: { userId: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $in: ['$$userId', '$likedBy'] } } },
                        { $count: 'likes' },
                    ],
                    as: 'likesReceived',
                },
            },
            {
                $project: {
                    _id: 1,
                    nom: 1,
                    email: 1,
                    role: 1,
                    postCount: { $size: '$posts' },
                    commentCount: { $size: '$comments' },
                    totalLikes: { $ifNull: [{ $arrayElemAt: ['$likesReceived.likes', 0] }, 0] },
                },
            },
            { $sort: { postCount: -1, commentCount: -1, totalLikes: -1 } },
            { $limit: 10 },
        ]);
        const recentlyCreatedPosts = await post_model_1.default.find({})
            .sort({ date: -1 })
            .limit(10)
            .select('_id content username userRole likes comments date')
            .lean()
            .then(posts => posts.map(post => {
            var _a;
            return ({
                _id: post._id.toString(),
                content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
                username: post.username,
                userRole: post.userRole,
                likes: post.likes || 0,
                commentsCount: ((_a = post.comments) === null || _a === void 0 ? void 0 : _a.length) || 0,
                date: post.date,
            });
        }));
        const recentlyCreatedAdmins = await admin_model_1.Admin.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id nom email phone createdAt')
            .lean()
            .then(admins => admins.map(admin => ({
            _id: admin._id.toString(),
            nom: admin.nom,
            email: admin.email,
            phone: admin.phone || undefined,
            date: admin.createdAt,
        })));
        const pendingVerifications = await request_model_1.default.find({})
            .populate('professional', 'nom email specialite')
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()
            .then(requests => requests.map(req => {
            var _a, _b, _c, _d, _e;
            return ({
                _id: req._id.toString(),
                professional: {
                    _id: ((_b = (_a = req.professional) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) || '',
                    nom: ((_c = req.professional) === null || _c === void 0 ? void 0 : _c.nom) || '',
                    email: ((_d = req.professional) === null || _d === void 0 ? void 0 : _d.email) || '',
                    specialite: ((_e = req.professional) === null || _e === void 0 ? void 0 : _e.specialite) || '',
                },
                specialite: req.specialite,
                createdAt: req.createdAt,
            });
        }));
        const recentContacts = await contact_model_1.default.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id firstName lastName email subject createdAt')
            .lean()
            .then(contacts => contacts.map(contact => ({
            _id: contact._id.toString(),
            firstName: contact.firstName,
            lastName: contact.lastName,
            email: contact.email,
            subject: contact.subject,
            createdAt: contact.createdAt,
        })));
        const timeline = {
            today: {
                users: await user_model_1.default.countDocuments({ createdAt: { $gte: startOfToday } }),
                posts: await post_model_1.default.countDocuments({ createdAt: { $gte: startOfToday } }),
                contacts: await contact_model_1.default.countDocuments({ createdAt: { $gte: startOfToday } }),
            },
            thisWeek: {
                users: await user_model_1.default.countDocuments({ createdAt: { $gte: startOfWeek } }),
                posts: await post_model_1.default.countDocuments({ createdAt: { $gte: startOfWeek } }),
                contacts: await contact_model_1.default.countDocuments({ createdAt: { $gte: startOfWeek } }),
            },
            thisMonth: {
                users: await user_model_1.default.countDocuments({ createdAt: { $gte: startOfMonth } }),
                posts: await post_model_1.default.countDocuments({ createdAt: { $gte: startOfMonth } }),
                contacts: await contact_model_1.default.countDocuments({ createdAt: { $gte: startOfMonth } }),
            },
        };
        return {
            totalUsers,
            totalPatients,
            totalProfessionals,
            totalPosts,
            totalComments,
            totalLikes,
            totalEvents,
            totalGalleryItems,
            totalContacts,
            totalPartners,
            totalRequests,
            totalAdmins,
            verificationStats,
            activeUsers,
            postsStats,
            galleryStats,
            mostActiveUsers: mostActiveUsers.map(user => ({
                _id: user._id.toString(),
                nom: user.nom,
                email: user.email,
                role: user.role,
                postCount: user.postCount,
                commentCount: user.commentCount,
                totalLikes: user.totalLikes,
            })),
            recentlyCreatedPosts,
            recentlyCreatedAdmins,
            pendingVerifications,
            recentContacts,
            timeline,
        };
    }
    static async searchAll(query) {
        const searchRegex = new RegExp(query, 'i');
        const [users, posts, admins, events, gallery, contacts, partners, requests] = await Promise.all([
            user_model_1.default.find({
                $or: [
                    { nom: searchRegex },
                    { email: searchRegex },
                ],
            })
                .select('_id nom email role is_verified')
                .lean()
                .then(users => users.map(user => ({
                _id: user._id.toString(),
                nom: user.nom,
                email: user.email,
                role: user.role,
                is_verified: user.is_verified,
            }))),
            post_model_1.default.find({
                $or: [
                    { content: searchRegex },
                    { hashtags: searchRegex },
                    { username: searchRegex },
                ],
            })
                .select('_id content username userRole likes date')
                .sort({ date: -1 })
                .limit(20)
                .lean()
                .then(posts => posts.map(post => ({
                _id: post._id.toString(),
                content: post.content.substring(0, 150) + (post.content.length > 150 ? '...' : ''),
                username: post.username,
                userRole: post.userRole,
                likes: post.likes || 0,
                date: post.date,
            }))),
            admin_model_1.Admin.find({
                $or: [
                    { nom: searchRegex },
                    { email: searchRegex },
                    { phone: searchRegex },
                ],
            })
                .select('_id nom email phone createdAt')
                .sort({ createdAt: -1 })
                .lean()
                .then(admins => admins.map(admin => ({
                _id: admin._id.toString(),
                nom: admin.nom,
                email: admin.email,
                phone: admin.phone || undefined,
                createdAt: admin.createdAt,
            }))),
            event_model_1.Event.find({
                $or: [
                    { name: searchRegex },
                    { description: searchRegex },
                    { address: searchRegex },
                    { category: searchRegex },
                ],
            })
                .select('_id name address category createdAt')
                .sort({ createdAt: -1 })
                .limit(20)
                .lean()
                .then(events => events.map(event => ({
                _id: event._id.toString(),
                name: event.name,
                address: event.address,
                category: event.category || '',
                createdAt: event.createdAt,
            }))),
            gallery_model_1.default.find({
                $or: [
                    { titre: searchRegex },
                    { desc: searchRegex },
                    { categorie: searchRegex },
                ],
            })
                .select('_id titre categorie views createdAt')
                .sort({ createdAt: -1 })
                .limit(20)
                .lean()
                .then(gallery => gallery.map(item => ({
                _id: item._id.toString(),
                titre: item.titre,
                categorie: item.categorie,
                views: item.views || 0,
                createdAt: item.createdAt,
            }))),
            contact_model_1.default.find({
                $or: [
                    { firstName: searchRegex },
                    { lastName: searchRegex },
                    { email: searchRegex },
                    { subject: searchRegex },
                    { message: searchRegex },
                ],
            })
                .select('_id firstName lastName email subject createdAt')
                .sort({ createdAt: -1 })
                .limit(20)
                .lean()
                .then(contacts => contacts.map(contact => ({
                _id: contact._id.toString(),
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                subject: contact.subject,
                createdAt: contact.createdAt,
            }))),
            partners_model_1.Partenaire.find({
                $or: [
                    { nom: searchRegex },
                    { email: searchRegex },
                    { service: searchRegex },
                    { description: searchRegex },
                ],
            })
                .select('_id nom email service createdAt')
                .sort({ createdAt: -1 })
                .limit(20)
                .lean()
                .then(partners => partners.map(partner => ({
                _id: partner._id.toString(),
                nom: partner.nom,
                email: partner.email,
                service: partner.service || '',
                createdAt: partner.createdAt,
            }))),
            request_model_1.default.find({
                $or: [
                    { specialite: searchRegex },
                ],
            })
                .populate('professional', 'nom email')
                .select('_id specialite professional createdAt')
                .sort({ createdAt: -1 })
                .limit(20)
                .lean()
                .then(requests => requests.map(req => {
                var _a;
                return ({
                    _id: req._id.toString(),
                    specialite: req.specialite,
                    professional: ((_a = req.professional) === null || _a === void 0 ? void 0 : _a.nom) || 'N/A',
                    createdAt: req.createdAt,
                });
            })),
        ]);
        return {
            users,
            posts,
            admins,
            events,
            gallery,
            contacts,
            partners,
            requests,
        };
    }
}
exports.AdminOverviewService = AdminOverviewService;
//# sourceMappingURL=adminOverview.service.js.map