"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères']
    },
    email: {
        type: String,
        required: [true, 'L\'email est obligatoire'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
    mdp: {
        type: String,
        required: function () {
            return this.oauthProvider === 'local';
        },
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    },
    dateNaissance: {
        type: Date,
        validate: {
            validator: function (value) {
                if (!value)
                    return true;
                const age = new Date().getFullYear() - value.getFullYear();
                return age >= 18;
            },
            message: 'Vous devez avoir au moins 18 ans'
        }
    },
    adresse: {
        type: String,
        trim: true
    },
    telephone: {
        type: String,
        trim: true,
        match: [/^[0-9+\-\s()]{10,}$/, 'Numéro de téléphone invalide']
    },
    photo: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["patient", "professional"],
        default: "patient",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    deactivatedAt: {
        type: Date,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: null
    },
    oauthProvider: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    oauthId: {
        type: String,
        sparse: true
    },
    is_verified: {
        type: Boolean,
        default: function () {
            return this.role === "professional" ? false : true;
        }
    },
    verification_status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: function () {
            return this.role === "professional" ? 'pending' : 'approved';
        }
    },
    rejection_reason: {
        type: String,
        default: null
    },
    specialite: {
        type: String,
        required: function () {
            return this.role === "professional";
        }
    },
    bio: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say'] },
    licenseNumber: { type: String, trim: true },
    languages: [{ type: String, trim: true }],
    education: [{
            degree: { type: String },
            field: { type: String },
            school: { type: String },
            year: { type: String }
        }],
    services: [{
            name: { type: String },
            price: { type: String },
            duration: { type: String }
        }],
    clinicName: { type: String, trim: true },
    clinicAddress: { type: String, trim: true },
    stripeCustomerId: {
        type: String,
        default: null
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'trialing', 'canceled'],
        default: 'inactive'
    },
    plan: {
        type: String,
        enum: ['monthly', 'yearly', null],
        default: null
    },
    currentPeriodEnd: {
        type: Date,
        default: null
    },
    saved_specialist: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    following: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User'
        }],
    groups: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Group'
        }]
}, {
    timestamps: true
});
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ is_verified: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: 1 });
UserSchema.methods.canReactivate = function () {
    if (!this.deactivatedAt)
        return false;
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return this.deactivatedAt > twoMonthsAgo;
};
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map