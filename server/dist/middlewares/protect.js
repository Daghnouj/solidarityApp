"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../src/user/user.model"));
const admin_model_1 = require("../src/admin/admin.model");
const env_1 = require("../config/env");
const protect = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: "Accès non autorisé. Token manquant."
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        let user = await user_model_1.default.findById(decoded.id).select("-mdp");
        if (!user) {
            const admin = await admin_model_1.Admin.findById(decoded.id).select("-mdp");
            if (admin) {
                req.user = admin;
                req.isAdmin = true;
                next();
                return;
            }
            res.status(401).json({
                success: false,
                message: "Token invalide. Utilisateur non trouvé."
            });
            return;
        }
        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: "Compte désactivé. Contactez l'administrateur."
            });
            return;
        }
        req.user = user;
        req.isAdmin = false;
        next();
    }
    catch (error) {
        console.error("❌ Erreur d'authentification:", error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({
                success: false,
                message: "Token invalide."
            });
        }
        else if (error.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                message: "Token expiré."
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "Erreur serveur lors de l'authentification."
            });
        }
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié"
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Le rôle ${req.user.role} n'est pas autorisé à accéder à cette route`
            });
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=protect.js.map