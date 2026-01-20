import express from 'express';
import {
  getAllProfessionals,
  getFilterOptions,
  getProfessionalById,
  updateProfessionalServices
} from './professional.controller';

const router = express.Router();

router.get('/', getAllProfessionals);
router.get('/filters', getFilterOptions);
router.get('/:id', getProfessionalById);
router.put('/:professionalId/services', updateProfessionalServices);

export default router;