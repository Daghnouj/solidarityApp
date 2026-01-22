import express from 'express';
import { VerificationController } from './verification.controller';
import { protectAdmin } from '../../../middlewares/protectAdmin';
import { validate } from '../../../middlewares/validator';
import { z } from 'zod';

const router = express.Router();

// Schémas de validation
const rejectProfessionalSchema = z.object({
  body: z.object({
    reason: z.string().min(1, 'La raison du refus est requise')
  })
});

// Toutes les routes protégées pour admin seulement
router.use(protectAdmin);

// Routes de vérification
router.put('/verify/:professionalId', VerificationController.verifyProfessional);
router.put('/reject/:professionalId', validate(rejectProfessionalSchema), VerificationController.rejectProfessional);
router.get('/unverified-requests', VerificationController.getUnverifiedProfessionalsRequests);
router.get('/all-requests', VerificationController.getAllRequests);
router.get('/request/:requestId', VerificationController.getRequestDetails);
router.get('/export', VerificationController.exportRequests);
router.get('/professional/:professionalId', VerificationController.getProfessionalDetails);

export const verificationRouter = router;