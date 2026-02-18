"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminNotificationRoutes = void 0;
const express_1 = require("express");
const adminNotification_controller_1 = require("./adminNotification.controller");
const protectAdmin_1 = require("../../../middlewares/protectAdmin");
const router = (0, express_1.Router)();
exports.adminNotificationRoutes = router;
router.get('/', protectAdmin_1.protectAdmin, adminNotification_controller_1.AdminNotificationController.getNotifications);
router.get('/unread-count', protectAdmin_1.protectAdmin, adminNotification_controller_1.AdminNotificationController.getUnreadCount);
router.patch('/:notificationId/read', protectAdmin_1.protectAdmin, adminNotification_controller_1.AdminNotificationController.markAsRead);
router.patch('/mark-all-read', protectAdmin_1.protectAdmin, adminNotification_controller_1.AdminNotificationController.markAllAsRead);
router.delete('/:notificationId', protectAdmin_1.protectAdmin, adminNotification_controller_1.AdminNotificationController.deleteNotification);
//# sourceMappingURL=adminNotification.routes.js.map