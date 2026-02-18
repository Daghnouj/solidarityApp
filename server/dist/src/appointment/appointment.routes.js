"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("./appointment.controller");
const protect_1 = require("../../middlewares/protect");
const router = (0, express_1.Router)();
router.get('/professional', protect_1.protect, (0, protect_1.authorize)('professional'), appointment_controller_1.AppointmentController.getForProfessional);
router.get('/stats', protect_1.protect, (0, protect_1.authorize)('professional'), appointment_controller_1.AppointmentController.getStats);
router.patch('/:id/status', protect_1.protect, (0, protect_1.authorize)('professional'), appointment_controller_1.AppointmentController.updateStatus);
router.post('/', protect_1.protect, appointment_controller_1.AppointmentController.create);
router.get('/my-appointments', protect_1.protect, appointment_controller_1.AppointmentController.getForPatient);
exports.default = router;
//# sourceMappingURL=appointment.routes.js.map