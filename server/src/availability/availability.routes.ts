import express from 'express';
import { AvailabilityController } from './availability.controller';
import { protect } from '../../middlewares/protect';

const router = express.Router();

router.post('/add', protect, AvailabilityController.addAvailability);
router.get('/', protect, AvailabilityController.getAvailabilities);
router.put('/:id', protect, AvailabilityController.updateAvailability);
router.delete('/:id', protect, AvailabilityController.deleteAvailability);
// router.get('/colors', protect, AvailabilityController.getColorOptions);
router.get('/professionals', protect, AvailabilityController.getProfessionals);

export default router;