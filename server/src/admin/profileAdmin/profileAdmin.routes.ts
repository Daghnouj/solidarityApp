import express from 'express';
import { ProfileAdminController } from './profileAdmin.controller';
import { protectAdmin } from '../../../middlewares/protectAdmin';
import { validate } from '../../../middlewares/validator';
import { uploadProfile } from '../../../config/cloudinary/cloudinary';
import { z } from 'zod';

const router = express.Router();

// Schémas de validation
const updateProfileSchema = z.object({
  body: z.object({
    nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
    email: z.string().email('Email invalide').optional(),
    phone: z.string().optional()
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'L\'ancien mot de passe est requis'),
    newPassword: z.string().min(6, 'Le nouveau mot de passe doit contenir au moins 6 caractères')
  })
});

// Toutes les routes protégées pour admin seulement
router.use(protectAdmin);

// Routes du profil admin
router.get('/profile', ProfileAdminController.getAdminProfile);
router.put('/profile', validate(updateProfileSchema), ProfileAdminController.updateAdminProfile);
router.put('/password', validate(changePasswordSchema), ProfileAdminController.updateAdminPassword);
router.delete('/account', ProfileAdminController.deleteAdminAccount);

// Photo de profil (Cloudinary)
router.put(
  '/profile-photo',
  uploadProfile.single('adminPhoto'),
  ProfileAdminController.updateAdminProfilePhoto
);

export const profileAdminRouter = router;