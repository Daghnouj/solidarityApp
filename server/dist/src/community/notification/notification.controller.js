"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markOneAsRead = exports.markAsRead = exports.getUserNotifications = void 0;
const notification_service_1 = require("./notification.service");
const getUserNotifications = async (req, res) => {
    try {
        const notifications = await notification_service_1.NotificationService.getUserNotifications(req.user._id);
        res.json(notifications);
    }
    catch (error) {
        console.error('Erreur récupération notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};
exports.getUserNotifications = getUserNotifications;
const markAsRead = async (req, res) => {
    try {
        await notification_service_1.NotificationService.markAsRead(req.user._id);
        res.json({
            success: true
        });
    }
    catch (error) {
        console.error('Erreur marquage comme lu:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};
exports.markAsRead = markAsRead;
const markOneAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await notification_service_1.NotificationService.markOneAsRead(req.user._id, id);
        res.json({
            success: true
        });
    }
    catch (error) {
        console.error('Erreur marquage individuel comme lu:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur'
        });
    }
};
exports.markOneAsRead = markOneAsRead;
//# sourceMappingURL=notification.controller.js.map