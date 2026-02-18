"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileAdminRouter = void 0;
const express_1 = __importDefault(require("express"));
const profileAdmin_controller_1 = require("./profileAdmin.controller");
const protectAdmin_1 = require("../../../middlewares/protectAdmin");
const validator_1 = require("../../../middlewares/validator");
const cloudinary_1 = require("../../../config/cloudinary/cloudinary");
const zod_1 = require("zod");
const router = express_1.default.Router();
const updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        nom: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
        email: zod_1.z.string().email('Email invalide').optional(),
        phone: zod_1.z.string().optional()
    })
});
const changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string().min(1, 'L\'ancien mot de passe est requis'),
        newPassword: zod_1.z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
    })
});
router.use(protectAdmin_1.protectAdmin);
router.get('/profile', profileAdmin_controller_1.ProfileAdminController.getAdminProfile);
router.put('/profile', (0, validator_1.validate)(updateProfileSchema), profileAdmin_controller_1.ProfileAdminController.updateAdminProfile);
router.put('/password', (0, validator_1.validate)(changePasswordSchema), profileAdmin_controller_1.ProfileAdminController.updateAdminPassword);
router.delete('/account', profileAdmin_controller_1.ProfileAdminController.deleteAdminAccount);
router.put('/profile-photo', cloudinary_1.uploadProfile.single('adminPhoto'), profileAdmin_controller_1.ProfileAdminController.updateAdminProfilePhoto);
exports.profileAdminRouter = router;
//# sourceMappingURL=profileAdmin.routes.js.map