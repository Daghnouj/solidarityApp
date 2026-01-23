import { Admin } from '../admin.model';
import Post from '../../community/post/post.model';
import User from '../../user/user.model';
import { Event } from '../../event/event.model';
import GalerieModel from '../../gallery/gallery.model';
import Contact from '../../contact/contact.model';
import { Partenaire } from '../../partners/partners.model';
import Request from '../../request/request.model';
import { AdminOverviewData, AdminSearchResult } from './adminOverview.types';

export class AdminOverviewService {
  static async getOverviewData(): Promise<AdminOverviewData> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    // Statistiques générales
    const [
      totalUsers,
      totalPatients,
      totalProfessionals,
      totalPosts,
      totalEvents,
      totalGalleryItems,
      totalContacts,
      totalPartners,
      totalRequests,
      totalAdmins
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'professional' }),
      Post.countDocuments(),
      Event.countDocuments(),
      GalerieModel.countDocuments(),
      Contact.countDocuments(),
      Partenaire.countDocuments(),
      Request.countDocuments(),
      Admin.countDocuments()
    ]);

    // Total Comments
    const commentsAggregation = await Post.aggregate([
      { $unwind: '$comments' },
      { $count: 'totalComments' },
    ]);
    const totalComments = commentsAggregation.length > 0 ? commentsAggregation[0].totalComments : 0;

    // Total Likes
    const likesAggregation = await Post.aggregate([
      { $project: { _id: 0, likes: { $size: '$likedBy' } } },
      { $group: { _id: null, totalLikes: { $sum: '$likes' } } },
    ]);
    const totalLikes = likesAggregation.length > 0 ? likesAggregation[0].totalLikes : 0;

    // Statistiques de vérification
    const verificationStats = {
      pending: await User.countDocuments({ verification_status: 'pending' }),
      approved: await User.countDocuments({ verification_status: 'approved' }),
      rejected: await User.countDocuments({ verification_status: 'rejected' }),
    };

    // Statistiques d'activité utilisateurs
    const activeUsers = {
      online: await User.countDocuments({ isOnline: true }),
      offline: await User.countDocuments({ isOnline: false }),
      newThisWeek: await User.countDocuments({ createdAt: { $gte: startOfWeek } }),
      newThisMonth: await User.countDocuments({ createdAt: { $gte: startOfMonth } }),
    };

    // Statistiques de posts - Top hashtags
    const hashtagsAggregation = await Post.aggregate([
      { $unwind: '$hashtags' },
      { $group: { _id: '$hashtags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const topHashtags = hashtagsAggregation.map(item => ({
      hashtag: item._id,
      count: item.count,
    }));
    const uniqueHashtags = await Post.aggregate([
      { $unwind: '$hashtags' },
      { $group: { _id: '$hashtags' } },
      { $count: 'total' },
    ]);
    const totalHashtags = uniqueHashtags.length > 0 ? uniqueHashtags[0].total : 0;

    const postsStats = {
      totalHashtags,
      topHashtags,
      postsThisWeek: await Post.countDocuments({ createdAt: { $gte: startOfWeek } }),
      postsThisMonth: await Post.countDocuments({ createdAt: { $gte: startOfMonth } }),
    };

    // Statistiques de galerie
    const galleryViewsAggregation = await GalerieModel.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = galleryViewsAggregation.length > 0 ? galleryViewsAggregation[0].totalViews : 0;

    const galleryByCategory = await GalerieModel.aggregate([
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

    // Utilisateurs les plus actifs
    const mostActiveUsers = await User.aggregate([
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

    // Posts récents avec plus de détails
    const recentlyCreatedPosts = await Post.find({})
      .sort({ date: -1 })
      .limit(10)
      .select('_id content username userRole likes comments date')
      .lean()
      .then(posts => posts.map(post => ({
        _id: post._id.toString(),
        content: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
        username: post.username,
        userRole: post.userRole,
        likes: post.likes || 0,
        commentsCount: post.comments?.length || 0,
        date: post.date,
      })));

    // Admins récents
    const recentlyCreatedAdmins = await Admin.find({})
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

    // Demandes de vérification en attente
    const pendingVerifications = await Request.find({})
      .populate('professional', 'nom email specialite')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()
      .then(requests => requests.map(req => ({
        _id: req._id.toString(),
        professional: {
          _id: (req.professional as any)?._id?.toString() || '',
          nom: (req.professional as any)?.nom || '',
          email: (req.professional as any)?.email || '',
          specialite: (req.professional as any)?.specialite || '',
        },
        specialite: req.specialite,
        createdAt: req.createdAt,
      })));

    // Contacts récents
    const recentContacts = await Contact.find({})
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

    // Statistiques temporelles
    const timeline = {
      today: {
        users: await User.countDocuments({ createdAt: { $gte: startOfToday } }),
        posts: await Post.countDocuments({ createdAt: { $gte: startOfToday } }),
        contacts: await Contact.countDocuments({ createdAt: { $gte: startOfToday } }),
      },
      thisWeek: {
        users: await User.countDocuments({ createdAt: { $gte: startOfWeek } }),
        posts: await Post.countDocuments({ createdAt: { $gte: startOfWeek } }),
        contacts: await Contact.countDocuments({ createdAt: { $gte: startOfWeek } }),
      },
      thisMonth: {
        users: await User.countDocuments({ createdAt: { $gte: startOfMonth } }),
        posts: await Post.countDocuments({ createdAt: { $gte: startOfMonth } }),
        contacts: await Contact.countDocuments({ createdAt: { $gte: startOfMonth } }),
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

  static async searchAll(query: string): Promise<AdminSearchResult> {
    const searchRegex = new RegExp(query, 'i');

    const [users, posts, admins, events, gallery, contacts, partners, requests] = await Promise.all([
      // Users
      User.find({
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

      // Posts
      Post.find({
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

      // Admins
      Admin.find({
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

      // Events
      Event.find({
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

      // Gallery
      GalerieModel.find({
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

      // Contacts
      Contact.find({
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

      // Partners
      Partenaire.find({
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

      // Requests
      Request.find({
        $or: [
          { specialite: searchRegex },
        ],
      })
        .populate('professional', 'nom email')
        .select('_id specialite professional createdAt')
        .sort({ createdAt: -1 })
        .limit(20)
        .lean()
        .then(requests => requests.map(req => ({
          _id: req._id.toString(),
          specialite: req.specialite,
          professional: (req.professional as any)?.nom || 'N/A',
          createdAt: req.createdAt,
        }))),
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