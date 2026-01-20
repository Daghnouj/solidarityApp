import express from 'express';
import { AuthAdminController } from './authAdmin.controller';

import { z } from 'zod';
import { validate } from '../../../middlewares/validator';

const router = express.Router();

// Schémas de validation spécifiques admin
const adminSignupSchema = z.object({
  body: z.object({
    nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Email invalide'),
    mdp: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    phone: z.string().optional()
  })
});

const adminLoginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    mdp: z.string().min(1, 'Le mot de passe est requis')
  })
});

// Routes d'authentification admin
router.post('/signup', validate(adminSignupSchema), AuthAdminController.signup);
router.post('/login', validate(adminLoginSchema), AuthAdminController.login);
router.post('/logout', AuthAdminController.logout);

export const authAdminRouter = router;