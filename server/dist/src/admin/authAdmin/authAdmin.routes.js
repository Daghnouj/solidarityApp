"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const authAdmin_controller_1 = require("./authAdmin.controller");
const zod_1 = require("zod");
const validator_1 = require("../../../middlewares/validator");
const router = express_1.default.Router();
const adminSignupSchema = zod_1.z.object({
    body: zod_1.z.object({
        nom: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
        email: zod_1.z.string().email('Email invalide'),
        mdp: zod_1.z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        phone: zod_1.z.string().optional()
    })
});
const adminLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email invalide'),
        mdp: zod_1.z.string().min(1, 'Le mot de passe est requis')
    })
});
router.post('/signup', (0, validator_1.validate)(adminSignupSchema), authAdmin_controller_1.AuthAdminController.signup);
router.post('/login', (0, validator_1.validate)(adminLoginSchema), authAdmin_controller_1.AuthAdminController.login);
router.post('/logout', authAdmin_controller_1.AuthAdminController.logout);
exports.authAdminRouter = router;
//# sourceMappingURL=authAdmin.routes.js.map