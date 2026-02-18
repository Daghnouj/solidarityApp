"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("./event.controller");
const protectAdmin_1 = require("../../middlewares/protectAdmin");
const validator_1 = require("../../middlewares/validator");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../../config/cloudinary/cloudinary");
const router = express_1.default.Router();
const eventStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.cloudinary,
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
            const name = file.originalname.split('.')[0];
            const timestamp = Date.now();
            return `event_${name}_${timestamp}`;
        }
    },
});
const uploadEventImages = (0, multer_1.default)({
    storage: eventStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 4
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Type de fichier non autorisé. Seuls JPG, PNG et WebP sont acceptés.'));
        }
    }
});
router.post('/', protectAdmin_1.protectAdmin, uploadEventImages.array('photo', 4), (0, validator_1.validate)(validator_1.eventValidation.create), event_controller_1.EventController.createEvent);
router.get('/', (0, validator_1.validate)(validator_1.eventValidation.getAll), event_controller_1.EventController.getEvents);
router.get('/:id', validator_1.validateObjectId, (0, validator_1.validate)(validator_1.eventValidation.getById), event_controller_1.EventController.getEventById);
router.put('/:id', protectAdmin_1.protectAdmin, validator_1.validateObjectId, uploadEventImages.array('photo', 4), (0, validator_1.validate)(validator_1.eventValidation.update), event_controller_1.EventController.updateEvent);
router.delete('/:id', protectAdmin_1.protectAdmin, validator_1.validateObjectId, (0, validator_1.validate)(validator_1.eventValidation.delete), event_controller_1.EventController.deleteEvent);
exports.default = router;
//# sourceMappingURL=event.routes.js.map