"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const availability_controller_1 = require("./availability.controller");
const protect_1 = require("../../middlewares/protect");
const router = express_1.default.Router();
router.post('/add', protect_1.protect, availability_controller_1.AvailabilityController.addAvailability);
router.get('/', protect_1.protect, availability_controller_1.AvailabilityController.getAvailabilities);
router.put('/:id', protect_1.protect, availability_controller_1.AvailabilityController.updateAvailability);
router.delete('/:id', protect_1.protect, availability_controller_1.AvailabilityController.deleteAvailability);
router.get('/professionals', protect_1.protect, availability_controller_1.AvailabilityController.getProfessionals);
router.get('/slots', availability_controller_1.AvailabilityController.getSlots);
exports.default = router;
//# sourceMappingURL=availability.routes.js.map