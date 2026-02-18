import express from 'express';
import { EventController } from './event.controller';
import { protectAdmin } from '../../middlewares/protectAdmin';
import { protect } from '../../middlewares/protect';
import { eventValidation, validate, validateObjectId } from '../../middlewares/validator';

// Configuration Cloudinary pour les événements
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import { cloudinary } from '../../config/cloudinary/cloudinary';

const router = express.Router();

// Storage Cloudinary pour les événements
const eventStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'events',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{
      width: 1200,
      height: 800,
      crop: 'fill',
      quality: 'auto:good'
    }],
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      return `event_${name}_${timestamp}_${random}`;
    }
  } as any,
});

const uploadEventImages = multer({
  storage: eventStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 4 // Maximum 4 fichiers 
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Seuls JPG, PNG et WebP sont acceptés.'));
    }
  }
});

// Routes
router.post(
  '/',
  protectAdmin,
  uploadEventImages.array('photo', 4),
  validate(eventValidation.create),
  EventController.createEvent
);

router.get(
  '/',
  validate(eventValidation.getAll),
  EventController.getEvents
);

router.get(
  '/:id',
  validateObjectId,
  validate(eventValidation.getById),
  EventController.getEventById
);

router.put(
  '/:id',
  protectAdmin,
  validateObjectId,
  uploadEventImages.array('photo', 4),
  validate(eventValidation.update),
  EventController.updateEvent
);

router.delete(
  '/:id',
  protectAdmin,
  validateObjectId,
  validate(eventValidation.delete),
  EventController.deleteEvent
);

router.post(
  '/:id/participate',
  protect,
  validateObjectId,
  EventController.toggleParticipation
);

router.get(
  '/:id/members',
  protectAdmin,
  validateObjectId,
  EventController.getEventMembers
);

router.post(
  '/:id/rate',
  protect,
  validateObjectId,
  EventController.submitRating
);

export default router;