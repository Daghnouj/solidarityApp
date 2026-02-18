"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOverviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const adminOverview_controller_1 = require("./adminOverview.controller");
const protectAdmin_1 = require("../../../middlewares/protectAdmin");
const router = express_1.default.Router();
router.get('/', protectAdmin_1.protectAdmin, adminOverview_controller_1.AdminOverviewController.getOverview);
router.get('/search', protectAdmin_1.protectAdmin, adminOverview_controller_1.AdminOverviewController.search);
exports.adminOverviewRoutes = router;
//# sourceMappingURL=adminOverview.routes.js.map