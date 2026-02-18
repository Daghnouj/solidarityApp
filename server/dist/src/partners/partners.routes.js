"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const partners_controller_1 = require("./partners.controller");
const protectAdmin_1 = require("../../middlewares/protectAdmin");
const cloudinary_1 = require("../../config/cloudinary/cloudinary");
const validator_1 = require("../../middlewares/validator");
const router = (0, express_1.Router)();
router.post('add/', protectAdmin_1.protectAdmin, cloudinary_1.uploadPartenaireLogo.single('logo'), (0, validator_1.validate)(validator_1.partenaireValidation.create), partners_controller_1.partenaireController.createPartenaire);
router.get('/', (0, validator_1.validate)(validator_1.partenaireValidation.getAll), partners_controller_1.partenaireController.getPartenaires);
router.get('/:id', (0, validator_1.validate)(validator_1.partenaireValidation.getById), partners_controller_1.partenaireController.getPartenaireById);
router.put('/:id', protectAdmin_1.protectAdmin, cloudinary_1.uploadPartenaireLogo.single('logo'), (0, validator_1.validate)(validator_1.partenaireValidation.update), partners_controller_1.partenaireController.updatePartenaire);
router.delete('/:id', protectAdmin_1.protectAdmin, (0, validator_1.validate)(validator_1.partenaireValidation.delete), partners_controller_1.partenaireController.deletePartenaire);
exports.default = router;
//# sourceMappingURL=partners.routes.js.map