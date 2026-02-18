"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_model_1 = require("../src/admin/admin.model");
const env_1 = require("../config/env");
const protectAdmin = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Accès non autorisé. Token admin manquant."
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: "Accès réservé aux administrateurs."
            });
            return;
        }
        const admin = await admin_model_1.Admin.findById(decoded.id).select("-mdp");
        if (!admin) {
            res.status(401).json({
                success: false,
                message: "Token admin invalide. Administrateur non trouvé."
            });
            return;
        }
        req.admin = {
            id: admin._id.toString(),
            role: 'admin'
        };
        next();
    }
    catch (error) {
        console.error("❌ Erreur d'authentification admin:", error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                success: false,
                message: "Token admin invalide."
            });
        }
        else if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: "Token admin expiré."
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Erreur serveur lors de l'authentification admin."
            });
        }
    }
};
exports.protectAdmin = protectAdmin;
//# sourceMappingURL=protectAdmin.js.map