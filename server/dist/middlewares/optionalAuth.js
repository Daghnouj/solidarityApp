"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_model_1 = require("../src/admin/admin.model");
const env_1 = require("../config/env");
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        if (!token) {
            req.isAdmin = false;
            next();
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (decoded.role === 'admin') {
            const admin = await admin_model_1.Admin.findById(decoded.id).select("-mdp");
            if (admin) {
                req.admin = admin;
                req.isAdmin = true;
                next();
                return;
            }
        }
        req.isAdmin = false;
        next();
    }
    catch (error) {
        req.isAdmin = false;
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=optionalAuth.js.map