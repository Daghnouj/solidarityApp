// Types for the frontend blog module

export type BlogCategory =
    | 'Mental Well-being'
    | 'Stress Management'
    | 'Therapy & Coaching'
    | 'Social Relations'
    | 'Personal Development'
    | 'News'
    | 'Testimonials';

export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogComment {
    _id: string;
    user: string;
    username: string;
    userPhoto?: string;
    userRole?: 'patient' | 'professional' | 'admin';
    text: string;
    date: string;
    edited?: boolean;
    isAnonymous?: boolean;
}

export interface BlogAuthor {
    _id: string;
    nom: string;
    prenom?: string;
    photo?: string;
    role: 'admin' | 'professional' | 'patient';
    specialite?: string;
    bio?: string;
}

export interface BlogSEO {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
}

export interface BlogArticle {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    author: BlogAuthor;
    authorName: string;
    authorPhoto?: string;
    authorRole: 'admin' | 'professional';
    category: BlogCategory;
    tags: string[];
    status: BlogStatus;
    publishedAt?: string;
    views: number;
    likes: string[];
    comments: BlogComment[];
    featured: boolean;
    seo?: BlogSEO;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBlogArticleDTO {
    title: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    category: BlogCategory;
    tags?: string[];
    status?: BlogStatus;
    featured?: boolean;
    seo?: BlogSEO;
}

export interface UpdateBlogArticleDTO {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    category?: BlogCategory;
    tags?: string[];
    status?: BlogStatus;
    featured?: boolean;
    seo?: BlogSEO;
}

export interface AddCommentDTO {
    text: string;
    isAnonymous?: boolean;
}

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

export interface BlogListResponse {
    articles: BlogArticle[];
    total: number;
    page: number;
    totalPages: number;
}

export interface CategoryWithCount {
    _id: string;
    count: number;
}

export interface TagWithCount {
    _id: string;
    count: number;
}

export interface ArticleStats {
    views: number;
    likes: number;
    comments: number;
}
