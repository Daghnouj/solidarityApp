import { Document, Types } from 'mongoose';

// Blog categories
export type BlogCategory =
    | 'Mental Well-being'
    | 'Stress Management'
    | 'Therapy & Coaching'
    | 'Social Relations'
    | 'Personal Development'
    | 'News'
    | 'Testimonials';

// Article statuses
export type BlogStatus = 'draft' | 'published' | 'archived';

// Interface for comments
export interface IBlogComment {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    username: string;
    userPhoto?: string;
    userRole?: 'patient' | 'professional' | 'admin';
    text: string;
    date: Date;
    edited?: boolean;
    isAnonymous?: boolean;
}

// Interface for SEO metadata
export interface IBlogSEO {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
}

// Main interface for a blog article
export interface IBlogArticle extends Document {
    _id: Types.ObjectId;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    author: Types.ObjectId;
    authorModel: 'User' | 'Admin';
    authorName: string;
    authorPhoto?: string;
    authorRole: 'admin' | 'professional';
    category: BlogCategory;
    tags: string[];
    status: BlogStatus;
    publishedAt?: Date;
    views: number;
    viewedBy: Array<{
        type: 'user' | 'anon';
        id?: string;
        ip: string;
        device: string;
        date: Date;
    }>;
    likes: Types.ObjectId[];
    comments: IBlogComment[];
    featured: boolean;
    seo?: IBlogSEO;
    createdAt: Date;
    updatedAt: Date;
}

// DTO to create an article
export interface CreateBlogArticleDTO {
    title: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    category: BlogCategory;
    tags?: string[];
    status?: BlogStatus;
    featured?: boolean;
    seo?: IBlogSEO;
}

// DTO to update an article
export interface UpdateBlogArticleDTO {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    category?: BlogCategory;
    tags?: string[];
    status?: BlogStatus;
    featured?: boolean;
    seo?: IBlogSEO;
}

// DTO to add a comment
export interface AddCommentDTO {
    text: string;
    isAnonymous?: boolean;
}

// Query options for the article list
export interface BlogQueryOptions {
    page?: number;
    limit?: number;
    category?: BlogCategory;
    tag?: string;
    search?: string;
    status?: BlogStatus;
    featured?: boolean;
    sortBy?: 'recent' | 'popular' | 'mostCommented' | 'mostLiked';
    author?: string;
}
