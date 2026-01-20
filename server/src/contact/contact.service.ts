import { IContact, ContactRequest, ContactResponse } from './contact.types';
import Contact from './contact.model';
import { emailService } from '../email/email.service';

export class ContactService {
  public async createContact(contactData: ContactRequest): Promise<ContactResponse> {
    try {
      // Création du contact
      const newContact: IContact = new Contact(contactData);
      await newContact.save();

      // Conversion pour l'email
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

      // Envoi des emails
      await emailService.sendAdminNotification(contactEmailData);
      await emailService.sendUserConfirmation(contactEmailData);

      return {
        success: true,
        message: 'Message envoyé avec succès',
        data: newContact
      };
 
    } catch (error: any) {
      console.error('Erreur dans ContactService:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((val: any) => val.message);
        return {
          success: false,
          message: messages.join(', ')
        };
      }
      
      // Gestion spécifique des erreurs d'envoi d'email
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

  public async verifyEmailConfig(): Promise<boolean> {
    return await emailService.verifyConfig();
  }
}

export const contactService = new ContactService();