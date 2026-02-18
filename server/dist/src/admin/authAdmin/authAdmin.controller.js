"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAdminController = void 0;
const authAdmin_service_1 = require("./authAdmin.service");
class AuthAdminController {
    static async signup(req, res) {
        try {
            const adminData = req.body;
            const { admin, token } = await authAdmin_service_1.AuthAdminService.signup(adminData);
            const response = {
                token,
                role: 'admin',
                admin: {
                    id: admin._id.toString(),
                    nom: admin.nom,
                    email: admin.email,
                    phone: admin.phone,
                    photo: admin.photo
                }
            };
            res.status(201).json(response);
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Erreur lors de l\'inscription',
                error: error.message
            });
        }
    }
    static async login(req, res) {
        try {
            const loginData = req.body;
            const { admin, token } = await authAdmin_service_1.AuthAdminService.login(loginData);
            const response = {
                token,
                role: 'admin',
                admin: {
                    id: admin._id.toString(),
                    nom: admin.nom,
                    email: admin.email,
                    phone: admin.phone,
                    photo: admin.photo
                }
            };
            res.json(response);
        }
        catch (error) {
            res.status(400).json({
                message: error.message || 'Erreur lors de la connexion',
                error: error.message
            });
        }
    }
    static async logout(req, res) {
        try {
            const result = await authAdmin_service_1.AuthAdminService.logout();
            res.clearCookie("token");
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({
                message: error.message || 'Erreur serveur',
                error: error.message
            });
        }
    }
}
exports.AuthAdminController = AuthAdminController;
//# sourceMappingURL=authAdmin.controller.js.map