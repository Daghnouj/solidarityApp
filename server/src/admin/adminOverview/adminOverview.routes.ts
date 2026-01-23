import express from 'express';
import { AdminOverviewController } from './adminOverview.controller';
import { protectAdmin } from '../../../middlewares/protectAdmin';

const router = express.Router();

// Route pour l'aperçu général de l'administration
router.get('/', protectAdmin, AdminOverviewController.getOverview);

// Route pour la recherche globale (users, posts, admins, events, gallery, contacts, partners, requests)
router.get('/search', protectAdmin, AdminOverviewController.search);

export const adminOverviewRoutes = router;