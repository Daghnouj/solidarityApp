import { Router } from 'express';
import { partenaireController } from './partners.controller';
import { protectAdmin } from '../../middlewares/protectAdmin';
import { uploadPartenaireLogo } from '../../config/cloudinary/cloudinary';
import { validate, partenaireValidation } from '../../middlewares/validator';

const router = Router();

// Créer un partenaire (admin uniquement)
router.post(
  'add/',
  protectAdmin,
  uploadPartenaireLogo.single('logo'),
  validate(partenaireValidation.create),
  partenaireController.createPartenaire
);

// Récupérer tous les partenaires (public)
router.get(
  '/',
  validate(partenaireValidation.getAll),
  partenaireController.getPartenaires
);

// Récupérer un partenaire par ID (public)
router.get(
  '/:id',
  validate(partenaireValidation.getById),
  partenaireController.getPartenaireById
);

// Mettre à jour un partenaire (admin uniquement)
router.put(
  '/:id',
  protectAdmin,
  uploadPartenaireLogo.single('logo'),
  validate(partenaireValidation.update),
  partenaireController.updatePartenaire
);

// Supprimer un partenaire (admin uniquement)
router.delete(
  '/:id',
  protectAdmin,
  validate(partenaireValidation.delete),
  partenaireController.deletePartenaire
);

export default router;