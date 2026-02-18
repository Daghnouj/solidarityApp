"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = exports.EmailServiceImpl = void 0;
const nodemailer_1 = require("nodemailer");
const env_1 = require("../../config/env");
const email_templates_1 = require("./email.templates");
class EmailServiceImpl {
    constructor() {
        this.from = `"Solidarity" <${env_1.env.EMAIL_USER}>`;
        this.transporter = (0, nodemailer_1.createTransport)({
            service: "gmail",
            auth: {
                user: env_1.env.EMAIL_USER,
                pass: env_1.env.EMAIL_PASS,
            },
        });
    }
    async sendEmail(options) {
        try {
            const mailOptions = {
                from: options.from || this.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
            };
            await this.transporter.sendMail(mailOptions);
            console.log(`📧 Email sent to ${options.to}`);
        }
        catch (error) {
            console.error('❌ Error sending email:', error);
            throw new Error('Erreur lors de l\'envoi de l\'email');
        }
    }
    async sendOTPEmail(email, otp, userName) {
        await this.sendEmail({
            to: email,
            subject: "OTP pour réinitialisation du mot de passe - Solidarity",
            html: email_templates_1.EmailTemplates.generateOTPEmail(userName, otp),
        });
    }
    async sendVerificationEmail(email, userName) {
        await this.sendEmail({
            to: email,
            subject: "Validation de votre compte professionnel - Solidarity",
            html: email_templates_1.EmailTemplates.generateVerificationEmail(userName),
        });
    }
    async sendRejectionEmail(email, userName, reason) {
        await this.sendEmail({
            to: email,
            subject: "Compte professionnel non validé - Solidarity",
            html: email_templates_1.EmailTemplates.generateRejectionEmail(userName, reason),
        });
    }
    async sendAdminNotification(contact) {
        await this.sendEmail({
            to: env_1.env.EMAIL_USER,
            subject: `Nouveau contact: ${contact.subject}`,
            html: email_templates_1.EmailTemplates.generateAdminNotificationEmail(contact),
        });
    }
    async sendUserConfirmation(contact) {
        await this.sendEmail({
            to: contact.email,
            subject: `Confirmation: ${contact.subject}`,
            html: email_templates_1.EmailTemplates.generateUserConfirmationEmail(contact),
        });
    }
    async verifyConfig() {
        try {
            await this.transporter.verify();
            console.log('✅ Email transporter configured successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Email configuration error:', error);
            return false;
        }
    }
}
exports.EmailServiceImpl = EmailServiceImpl;
exports.emailService = new EmailServiceImpl();
//# sourceMappingURL=email.service.js.map