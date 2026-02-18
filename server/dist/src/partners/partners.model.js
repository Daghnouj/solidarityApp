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
exports.Partenaire = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PartenaireSchema = new mongoose_1.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est obligatoire']
    },
    email: {
        type: String,
        required: [true, 'L\'email est obligatoire'],
        unique: true,
        lowercase: true,
        trim: true
    },
    telephone: {
        type: String
    },
    adresse: {
        type: String
    },
    description: {
        type: String
    },
    logo: {
        url: String,
        public_id: String
    },
    service: {
        type: String
    },
    link: {
        type: String,
        required: [true, 'Le lien est obligatoire'],
        trim: true
    },
}, {
    timestamps: true
});
PartenaireSchema.index({ email: 1 });
PartenaireSchema.index({ idpart: 1 });
exports.Partenaire = mongoose_1.default.model('Partenaire', PartenaireSchema);
//# sourceMappingURL=partners.model.js.map