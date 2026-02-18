"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gallery_controller_1 = __importDefault(require("./gallery.controller"));
const protectAdmin_1 = require("../../middlewares/protectAdmin");
const gallery_middlewares_1 = require("./gallery.middlewares");
const router = express_1.default.Router();
router.get('/', gallery_controller_1.default.getGaleriesByCategorie);
router.get('/total', gallery_controller_1.default.getTotalVideos);
router.get('/:id', gallery_controller_1.default.getGalerieById);
router.post('/', protectAdmin_1.protectAdmin, gallery_middlewares_1.validateCreateGalerie, gallery_controller_1.default.createGalerie);
router.put('/:id', protectAdmin_1.protectAdmin, gallery_middlewares_1.validateUpdateGalerie, gallery_middlewares_1.checkGalerieExists, gallery_controller_1.default.updateGalerie);
router.delete('/:id', protectAdmin_1.protectAdmin, gallery_middlewares_1.checkGalerieExists, gallery_controller_1.default.deleteGalerie);
exports.default = router;
//# sourceMappingURL=gallery.routes.js.map