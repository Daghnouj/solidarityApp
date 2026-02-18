"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const protect_1 = require("../../../middlewares/protect");
const router = express_1.default.Router();
router.get('/', protect_1.protect, notification_controller_1.getUserNotifications);
router.patch('/mark-read', protect_1.protect, notification_controller_1.markAsRead);
router.patch('/:id/mark-read', protect_1.protect, notification_controller_1.markOneAsRead);
exports.default = router;
//# sourceMappingURL=notification.routes.js.map