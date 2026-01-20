import express from "express";
import GalerieController from './gallery.controller';
import { protectAdmin } from '../../middlewares/protectAdmin';
import { 
  validateCreateGalerie, 
  validateUpdateGalerie, 
  checkGalerieExists 
} from './gallery.middlewares';

const router = express.Router();

// Routes publiques
router.get('/', GalerieController.getGaleriesByCategorie);
router.get('/total', GalerieController.getTotalVideos);
// router.post('/:id/view', GalerieController.trackView);
router.get('/:id', GalerieController.getGalerieById);

// Routes admin (protégées)
router.post(
  '/',
  protectAdmin,
  validateCreateGalerie,
  GalerieController.createGalerie
);

router.put(
  '/:id',
  protectAdmin,
  validateUpdateGalerie,
  checkGalerieExists,
  GalerieController.updateGalerie
);

router.delete(
  '/:id',
  protectAdmin,
  checkGalerieExists,
  GalerieController.deleteGalerie
);

export default router;