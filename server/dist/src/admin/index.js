"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const express_1 = __importDefault(require("express"));
const adminOverview_routes_1 = require("./adminOverview/adminOverview.routes");
const security_1 = require("../../middlewares/security");
const router = express_1.default.Router();
router.use(security_1.basicSecurity);
router.use('/overview', adminOverview_routes_1.adminOverviewRoutes);
var admin_model_1 = require("./admin.model");
Object.defineProperty(exports, "Admin", { enumerable: true, get: function () { return admin_model_1.Admin; } });
//# sourceMappingURL=index.js.map