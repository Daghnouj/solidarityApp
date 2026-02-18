"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const contact_service_1 = require("./contact.service");
const socket_1 = require("../socket");
const createContact = async (req, res) => {
    try {
        const result = await contact_service_1.contactService.createContact(req.body, (0, socket_1.getIOInstance)());
        const statusCode = result.success ? 201 : 400;
        res.status(statusCode).json(result);
    }
    catch (error) {
        console.error('Erreur dans le contrôleur contact:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur inattendue'
        });
    }
};
exports.createContact = createContact;
//# sourceMappingURL=contact.controller.js.map