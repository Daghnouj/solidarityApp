"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const verification_controller_1 = require("./verification.controller");
const protectAdmin_1 = require("../../../middlewares/protectAdmin");
const validator_1 = require("../../../middlewares/validator");
const zod_1 = require("zod");
const router = express_1.default.Router();
const rejectProfessionalSchema = zod_1.z.object({
    body: zod_1.z.object({
        reason: zod_1.z.string().min(1, 'La raison du refus est requise')
    })
});
router.use(protectAdmin_1.protectAdmin);
router.put('/verify/:professionalId', verification_controller_1.VerificationController.verifyProfessional);
router.put('/reject/:professionalId', (0, validator_1.validate)(rejectProfessionalSchema), verification_controller_1.VerificationController.rejectProfessional);
router.get('/unverified-requests', verification_controller_1.VerificationController.getUnverifiedProfessionalsRequests);
router.get('/all-requests', verification_controller_1.VerificationController.getAllRequests);
router.get('/request/:requestId', verification_controller_1.VerificationController.getRequestDetails);
router.get('/export', verification_controller_1.VerificationController.exportRequests);
router.get('/professional/:professionalId', verification_controller_1.VerificationController.getProfessionalDetails);
exports.verificationRouter = router;
//# sourceMappingURL=verification.routes.js.map