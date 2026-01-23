import express from 'express';
import { authAdminRouter } from './authAdmin/authAdmin.routes';
import { adminOverviewRoutes } from './adminOverview/adminOverview.routes';
import { basicSecurity } from '../../middlewares/security';

const router = express.Router();

// Appliquer la sécurité de base à toutes les routes admin
router.use(basicSecurity);

router.use('/overview', adminOverviewRoutes);

// Export des types et modèles
export { Admin } from './admin.model';
export type { IAdmin, AdminRequest, AdminSignupDTO, AdminLoginDTO } from './admin.types';
export type { AdminOverviewData, AdminSearchResult } from './adminOverview/adminOverview.types';