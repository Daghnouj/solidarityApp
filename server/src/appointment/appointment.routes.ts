import { Router } from 'express';
import { AppointmentController } from './appointment.controller';
import { protect, authorize } from '../../middlewares/protect'; // Adjust path if needed

const router = Router();

// Routes pour les professionnels
router.get('/professional', protect, authorize('professional'), AppointmentController.getForProfessional);
router.get('/stats', protect, authorize('professional'), AppointmentController.getStats);
router.patch('/:id/status', protect, authorize('professional'), AppointmentController.updateStatus);

// Routes pour les patients
router.post('/', protect, AppointmentController.create);
router.get('/my-appointments', protect, AppointmentController.getForPatient);

export default router;
