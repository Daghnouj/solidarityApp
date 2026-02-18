"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactSchema = new mongoose_1.default.Schema({
    firstName: {
        type: String,
        required: [true, 'Le prénom est obligatoire'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Le nom est obligatoire'],
        trim: true
    },
    email: {
        type: String,
        required: [true, "L'email est obligatoire"],
        match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
        trim: true,
        lowercase: true
    },
    city: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Le téléphone est obligatoire'],
        trim: true
    },
    subject: {
        type: String,
        required: [true, 'Le sujet est obligatoire'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Le message est obligatoire'],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
const Contact = mongoose_1.default.model('Contact', contactSchema);
exports.default = Contact;
//# sourceMappingURL=contact.model.js.map