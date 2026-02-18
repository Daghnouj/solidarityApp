"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = exports.ContactService = void 0;
const contact_model_1 = __importDefault(require("./contact.model"));
const email_service_1 = require("../email/email.service");
const adminNotification_service_1 = require("../admin/adminNotification/adminNotification.service");
class ContactService {
    async createContact(contactData, io) {
        try {
            const newContact = new contact_model_1.default(contactData);
            await newContact.save();
            const contactEmailData = {
                firstName: newContact.firstName,
                lastName: newContact.lastName,
                email: newContact.email,
                city: newContact.city,
                phone: newContact.phone,
                subject: newContact.subject,
                message: newContact.message,
                createdAt: newContact.createdAt
            };
            await email_service_1.emailService.sendAdminNotification(contactEmailData);
            await email_service_1.emailService.sendUserConfirmation(contactEmailData);
            if (io) {
                try {
                    await adminNotification_service_1.AdminNotificationService.createNotification({
                        type: 'contact_request',
                        title: 'Nouvelle demande de contact',
                        message: `${newContact.firstName} ${newContact.lastName} a envoyé une demande de contact`,
                        data: {
                            contactId: newContact._id.toString(),
                            contactName: `${newContact.firstName} ${newContact.lastName}`,
                            contactEmail: newContact.email,
                            contactPhone: newContact.phone,
                            contactCity: newContact.city,
                            contactSubject: newContact.subject
                        },
                        io
                    });
                }
                catch (notifError) {
                    console.error('Error creating admin notification for contact:', notifError);
                }
            }
            return {
                success: true,
                message: 'Message envoyé avec succès',
                data: newContact
            };
        }
        catch (error) {
            console.error('Erreur dans ContactService:', error);
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map((val) => val.message);
                return {
                    success: false,
                    message: messages.join(', ')
                };
            }
            if (error.code === 'EAUTH' || error.code === 'EENVELOPE') {
                return {
                    success: false,
                    message: 'Erreur d\'envoi d\'email'
                };
            }
            return {
                success: false,
                message: 'Erreur serveur lors de la création du contact'
            };
        }
    }
    async verifyEmailConfig() {
        return await email_service_1.emailService.verifyConfig();
    }
}
exports.ContactService = ContactService;
exports.contactService = new ContactService();
//# sourceMappingURL=contact.service.js.map