"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const commentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: ['patient', 'professional']
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
const viewSchema = new mongoose_1.Schema({
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
const seoSchema = new mongoose_1.Schema({
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    ogImage: String
}, { _id: false });
const blogArticleSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Le titre est requis'],
        trim: true,
        maxlength: [200, 'Le titre ne peut pas dépasser 200 caractères']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Le contenu est requis']
    },
    excerpt: {
        type: String,
        required: [true, 'L\'extrait est requis'],
        maxlength: [300, 'L\'extrait ne peut pas dépasser 300 caractères']
    },
    coverImage: {
        type: String,
        default: null
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
        required: [true, 'La catégorie est requise'],
        enum: [
            'Bien-être Mental',
            'Gestion du Stress',
            'Thérapies et Coaching',
            'Relations Sociales',
            'Développement Personnel',
            'Actualités',
            'Témoignages'
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
            type: mongoose_1.Schema.Types.ObjectId,
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
blogArticleSchema.index({ slug: 1 });
blogArticleSchema.index({ status: 1, publishedAt: -1 });
blogArticleSchema.index({ category: 1 });
blogArticleSchema.index({ tags: 1 });
blogArticleSchema.index({ author: 1 });
blogArticleSchema.index({ featured: 1 });
blogArticleSchema.index({ createdAt: -1 });
blogArticleSchema.pre('validate', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        if (this.isNew) {
            this.slug = `${this.slug}-${Date.now()}`;
        }
    }
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});
exports.default = mongoose_1.default.model('BlogArticle', blogArticleSchema);
//# sourceMappingURL=blog.model.js.map