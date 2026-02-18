"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const requestSchema = new mongoose_1.default.Schema({
    professional: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    specialite: {
        type: String,
        required: true
    },
    situation_professionnelle: { type: String },
    intitule_diplome: { type: String },
    nom_etablissement: { type: String },
    date_obtention_diplome: { type: Date },
    biographie: { type: String },
    document: { type: String },
    services: [{ type: String }],
}, {
    timestamps: true
});
const Request = mongoose_1.default.model("Request", requestSchema);
exports.default = Request;
//# sourceMappingURL=request.model.js.map