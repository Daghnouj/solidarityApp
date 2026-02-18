"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplates = void 0;
class EmailTemplates {
    static generateOTPEmail(userName, otp) {
        return `
<div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <!-- En-tête Solidarity -->
    <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 22px; font-weight: bold; color: #000; margin-bottom: 5px;">Solidarity</div>
        <div style="font-size: 14px; color: #666;">Votre santé, notre priorité</div>
    </div>
    
    <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Code de vérification - Réinitialisation</h2>
    
    <p style="font-size: 16px; color: #555;">
        Bonjour <strong>${userName}</strong>,
    </p>
    
    <p style="font-size: 16px; color: #555;">
        Votre code de vérification pour la réinitialisation de votre mot de passe est :
    </p>
    
    <div style="text-align: center; margin: 20px 0;">
        <span style="
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            background-color: #007BFF;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            letter-spacing: 2px;">
            ${otp}
        </span>
    </div>
    
    <p style="font-size: 16px; color: #555;">
        Ce code expirera dans <strong>10 minutes</strong>. Ne le partagez avec personne.
    </p>
    
    <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin: 15px 0;">
        <p style="font-size: 14px; color: #666; margin: 0; text-align: center;">
            Pour votre sécurité, l'équipe Solidarity ne vous demandera jamais ce code.
        </p>
    </div>
    
    <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
        Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
    </p>
    
    <p style="font-size: 16px; color: #555;">
        Cordialement, <br>
        <strong>L'équipe Solidarity</strong>
    </p>
</div>
    `;
    }
    static generateVerificationEmail(userName) {
        return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <!-- En-tête Solidarity -->
    <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 24px; font-weight: bold; color: #28a745; margin-bottom: 5px;">Solidarity</div>
        <div style="font-size: 14px; color: #666;">Votre santé, notre priorité</div>
    </div>
    
    <h2 style="color: #28a745; text-align: center; margin-bottom: 20px;"> Félicitations ! Votre compte a été validé</h2>
    
    <p style="font-size: 16px; color: #555;">
        Bonjour <strong>${userName}</strong>,
    </p>
    
    <p style="font-size: 16px; color: #555;">
        Nous avons le plaisir de vous informer que votre compte professionnel sur l'application Solidarity a été validé avec succès.
    </p>
    
    <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #155724;"><strong>📱 Prochaines étapes :</strong></p>
        <ul style="color: #155724;">
            <li>Complétez votre profil professionnel</li>
            <li>Configurez vos disponibilités</li>
            <li>Commencez à recevoir des demandes de consultation</li>
        </ul>
    </div>
    
    <p style="font-size: 16px; color: #555;">
        Vous pouvez désormais accéder à toutes les fonctionnalités réservées aux professionnels.
    </p>
    
    <p style="font-size: 16px; color: #555;">
        Si vous avez des questions, n'hésitez pas à nous contacter.
    </p>
    
    <p style="font-size: 16px; color: #555;">
        Cordialement,<br>
        <strong>L'équipe Solidarity</strong>
    </p>
</div>
    `;
    }
    static generateRejectionEmail(userName, reason) {
        return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
    <!-- En-tête Solidarity -->
    <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 24px; font-weight: bold; color: #dc3545; margin-bottom: 5px;">Solidarity</div>
        <div style="font-size: 14px; color: #666;">Votre santé, notre priorité</div>
    </div>
    
    <h2 style="color: #dc3545; text-align: center; margin-bottom: 20px;"> Validation de compte refusée</h2>
    
    <p style="font-size: 16px; color: #555;">
        Bonjour <strong>${userName}</strong>,
    </p>
    
    <p style="font-size: 16px; color: #555;">
        Votre demande de compte professionnel n'a pas pu être validée pour le moment.
    </p>
    
    <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 0; color: #721c24;"><strong>Raison :</strong> ${reason}</p>
    </div>
    
    <p style="font-size: 16px; color: #555;">
        Vous pouvez modifier votre profil et soumettre à nouveau votre demande une fois les corrections effectuées.
    </p>
    
    <p style="font-size: 16px; color: #555;">
        Si vous avez des questions, n'hésitez pas à nous contacter.
    </p>
    
    <p style="font-size: 16px; color: #555;">
        Cordialement,<br>
        <strong>L'équipe Solidarity</strong>
    </p>
</div>
    `;
    }
    static generateAdminNotificationEmail(contact) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #007BFF; padding-bottom: 15px; }
        .contact-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; color: #007BFF; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="color: #007BFF; margin: 0;">Solidarity</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Nouveau message de contact</p>
    </div>

    <h2 style="color: #333;">Nouveau message reçu</h2>
    
    <div class="contact-info">
        <div class="field">
            <span class="label">Nom complet:</span> ${contact.firstName} ${contact.lastName}
        </div>
        <div class="field">
            <span class="label">Email:</span> ${contact.email}
        </div>
        <div class="field">
            <span class="label">Téléphone:</span> ${contact.phone}
        </div>
        <div class="field">
            <span class="label">Ville:</span> ${contact.city || 'Non spécifiée'}
        </div>
        <div class="field">
            <span class="label">Sujet:</span> ${contact.subject}
        </div>
        <div class="field">
            <span class="label">Message:</span><br>
            <div style="margin-top: 10px; padding: 15px; background: white; border-radius: 5px; border-left: 4px solid #007BFF;">
                ${contact.message.replace(/\n/g, '<br>')}
            </div>
        </div>
    </div>

    <div style="margin-top: 30px; padding: 15px; background: #e7f3ff; border-radius: 5px; text-align: center;">
        <p style="margin: 0; color: #0056b3;">
            <strong>Date de réception:</strong> ${new Date(contact.createdAt).toLocaleString('fr-FR')}
        </p>
    </div>
</body>
</html>
    `;
    }
    static generateUserConfirmationEmail(contact) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .confirmation { background: #f0f9ff; padding: 25px; border-radius: 10px; margin: 20px 0; border-left: 5px solid #007BFF; }
        .message-summary { background: white; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #dee2e6; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="color: #007BFF; margin: 0;">Solidarity</h1>
        <p style="color: #666; margin: 5px 0 0 0;">Confirmation de réception</p>
    </div>

    <div class="confirmation">
        <h2 style="color: #007BFF; margin-top: 0;">Bonjour ${contact.firstName},</h2>
        
        <p style="font-size: 16px; line-height: 1.6;">
            Nous avons bien reçu votre message concernant <strong>"${contact.subject}"</strong>.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6;">
            Notre équipe va l'étudier avec attention et vous répondra dans les plus brefs délais.
        </p>
    </div>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h3 style="color: #495057; margin-top: 0;">Récapitulatif de votre message :</h3>
        
        <div class="message-summary">
            <p><strong>Sujet :</strong> ${contact.subject}</p>
            <p><strong>Message :</strong></p>
            <div style="padding: 10px; background: #f8f9fa; border-radius: 4px;">
                ${contact.message.replace(/\n/g, '<br>')}
            </div>
        </div>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
        <p style="color: #666; font-size: 14px;">
            <strong>L'équipe Solidarity</strong><br>
            Votre santé, notre priorité
        </p>
        <p style="color: #999; font-size: 12px;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
        </p>
    </div>
</body>
</html>
    `;
    }
}
exports.EmailTemplates = EmailTemplates;
//# sourceMappingURL=email.templates.js.map