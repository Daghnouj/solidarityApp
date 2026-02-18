"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logoutUser = exports.submitRequest = exports.socialAuthCallback = exports.login = exports.signup = void 0;
const auth_service_1 = __importDefault(require("./auth.service"));
const socket_1 = require("../socket");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
const signup = async (req, res) => {
    try {
        console.log('=== SIGNUP DEBUG ===');
        console.log('📝 Body reçu:', req.body);
        console.log('📁 Fichier reçu dans controller:', req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'Aucun fichier');
        const file = req.file;
        const result = await auth_service_1.default.signup(req.body, file, (0, socket_1.getIOInstance)());
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Erreur signup:", error);
        res.status(400).json({ message: error.message });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const result = await auth_service_1.default.login(req.body, (0, socket_1.getIOInstance)());
        res.json(result);
    }
    catch (error) {
        console.error("Erreur login:", error);
        if (error.canReactivate) {
            res.status(403).json(error);
        }
        else {
            res.status(400).json({ message: error.message });
        }
    }
};
exports.login = login;
const socialAuthCallback = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.redirect(`${env_1.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`);
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
        res.redirect(`${env_1.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}`);
    }
    catch (error) {
        console.error("Social Auth Error:", error);
        res.redirect(`${env_1.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
    }
};
exports.socialAuthCallback = socialAuthCallback;
const submitRequest = async (req, res) => {
    try {
        const file = req.file;
        const result = await auth_service_1.default.submitRequest(req.body, req.user._id.toString(), file, (0, socket_1.getIOInstance)());
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Erreur submitRequest:", error);
        res.status(400).json({ message: error.message });
    }
};
exports.submitRequest = submitRequest;
const logoutUser = async (req, res) => {
    try {
        const result = await auth_service_1.default.logout(req.user._id.toString());
        res.clearCookie("token");
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Erreur logout:", error);
        res.status(500).json({ message: error.message });
    }
};
exports.logoutUser = logoutUser;
const getMe = async (req, res) => {
    try {
        const user = await auth_service_1.default.getMe(req.user._id.toString());
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map