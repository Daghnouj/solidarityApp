"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ViewSchema = new mongoose_1.Schema({
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
const GalerieSchema = new mongoose_1.Schema({
    titre: {
        type: String,
        required: [true, 'Le titre est requis'],
        unique: true,
        sparse: true
    },
    desc: {
        type: String,
        required: [true, 'La description est requise']
    },
    video: {
        type: String,
        required: [true, 'Le lien video est requis']
    },
    categorie: {
        type: String,
        required: true,
        enum: [
            "Bien-être Mental",
            "Gestion du Stress",
            "Thérapies et Coaching",
            "Relations Sociales",
            "Développement Personnel"
        ]
    },
    views: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    viewedBy: {
        type: [ViewSchema],
        default: []
    }
});
GalerieSchema.index({ categorie: 1 });
GalerieSchema.index({ createdAt: -1 });
exports.default = (0, mongoose_1.model)('Galerie', GalerieSchema);
//# sourceMappingURL=gallery.model.js.map