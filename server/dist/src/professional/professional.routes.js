"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const professional_controller_1 = require("./professional.controller");
const router = express_1.default.Router();
router.get('/', professional_controller_1.getAllProfessionals);
router.get('/filters', professional_controller_1.getFilterOptions);
router.get('/:id', professional_controller_1.getProfessionalById);
router.put('/:professionalId/services', professional_controller_1.updateProfessionalServices);
exports.default = router;
//# sourceMappingURL=professional.routes.js.map