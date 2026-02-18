"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AdminSchema = new mongoose_1.default.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true
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
        required: [true, 'Le mot de passe est obligatoire'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères']
    },
    role: {
        type: String,
        default: "admin",
        required: true
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[0-9+\-\s()]{10,}$/, 'Numéro de téléphone invalide']
    },
    photo: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});
AdminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcryptjs_1.default.compare(candidatePassword, this.mdp);
};
AdminSchema.pre('save', async function (next) {
    if (!this.isModified('mdp'))
        return next();
    this.mdp = await bcryptjs_1.default.hash(this.mdp, 12);
    next();
});
exports.Admin = mongoose_1.default.model("Admin", AdminSchema);
exports.default = exports.Admin;
//# sourceMappingURL=admin.model.js.map