"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminService = void 0;
const admin_model_1 = require("../admin.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../../config/env");
class AuthAdminService {
    static async signup(adminData) {
        const existingAdmin = await admin_model_1.Admin.findOne({ email: adminData.email });
        if (existingAdmin) {
            throw new Error('Admin existe déjà');
        }
        const admin = new admin_model_1.Admin(adminData);
        await admin.save();
        const token = this.generateToken(admin);
        return { admin, token };
    }
    static async login(loginData) {
        const admin = await admin_model_1.Admin.findOne({ email: loginData.email });
        if (!admin) {
            throw new Error('Admin non trouvé');
        }
        const isMatch = await admin.comparePassword(loginData.mdp);
        if (!isMatch) {
            throw new Error('Mot de passe incorrect');
        }
        const token = this.generateToken(admin);
        return { admin, token };
    }
    static async logout() {
        return { message: 'Déconnexion réussie' };
    }
    static generateToken(admin) {
        return jsonwebtoken_1.default.sign({ id: admin._id, role: "admin" }, env_1.env.JWT_SECRET, { expiresIn: "7d" });
    }
}
exports.AuthAdminService = AuthAdminService;
//# sourceMappingURL=authAdmin.service.js.map