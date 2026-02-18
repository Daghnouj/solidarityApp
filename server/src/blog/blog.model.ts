import mongoose, { Schema } from 'mongoose';
import { IBlogArticle, IBlogComment, BlogCategory, BlogStatus } from './blog.types';

// Schema for comments
const commentSchema = new Schema<IBlogComment>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userPhoto: {
        type: String,
        default: 'default.png'
    },
    userRole: {
        type: String,
        enum: ['patient', 'professional', 'admin']
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    edited: {
        type: Boolean,
        default: false
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
});

// Schema for views
const viewSchema = new Schema({
    type: {
        type: String,
        enum: ['user', 'anon'],
        required: true
    },
    id: {
        type: String
    },
    ip: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Schema for SEO metadata
const seoSchema = new Schema({
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String
}, { _id: false });

// Main schema for blog articles
const blogArticleSchema = new Schema<IBlogArticle>({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    excerpt: {
        type: String,
        required: [true, 'Excerpt is required'],
        maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    coverImage: {
        type: String,
        default: null
    },
    author: {
        type: Schema.Types.ObjectId,
        refPath: 'authorModel',
        required: true
    },
    authorModel: {
        type: String,
        required: true,
        enum: ['User', 'Admin'],
        default: 'User'
    },
    authorName: {
        type: String,
        required: true
    },
    authorPhoto: {
        type: String,
        default: 'default.png'
    },
    authorRole: {
        type: String,
        enum: ['admin', 'professional'],
        required: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Mental Well-being',
            'Stress Management',
            'Therapy & Coaching',
            'Social Relations',
            'Personal Development',
            'News',
            'Testimonials'
        ]
    },
    tags: {
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishedAt: {
        type: Date,
        default: null
    },
    views: {
        type: Number,
        default: 0
    },
    viewedBy: {
        type: [viewSchema],
        default: []
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: {
        type: [commentSchema],
        default: []
    },
    featured: {
        type: Boolean,
        default: false
    },
    seo: {
        type: seoSchema,
        default: null
    }
}, {
    timestamps: true
});

// Index to improve performance
blogArticleSchema.index({ slug: 1 });
blogArticleSchema.index({ status: 1, publishedAt: -1 });
blogArticleSchema.index({ category: 1 });
blogArticleSchema.index({ tags: 1 });
blogArticleSchema.index({ author: 1 });
blogArticleSchema.index({ featured: 1 });
blogArticleSchema.index({ createdAt: -1 });

// Pre-validate middleware to generate slug automatically
blogArticleSchema.pre('validate', function (next) {
    console.log('--- PRE-VALIDATE HOOK ---');
    console.log('Title modified:', this.isModified('title'));
    console.log('Current slug:', this.slug);

    if (this.isModified('title')) {
        // Generate slug from title
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/-+/g, '-'); // Remove multiple dashes

        // Add timestamp if slug already exists (for duplicates)
        if (this.isNew) {
            this.slug = `${this.slug}-${Date.now()}`;
        }
    }

    // Update publishedAt on first publication
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }

    next();
});

export default mongoose.model<IBlogArticle>('BlogArticle', blogArticleSchema);
