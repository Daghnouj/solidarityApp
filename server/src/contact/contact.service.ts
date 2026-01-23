import { Server } from 'socket.io';
import { IContact, ContactRequest, ContactResponse } from './contact.types';
import Contact from './contact.model';
import { emailService } from '../email/email.service';
import { AdminNotificationService } from '../admin/adminNotification/adminNotification.service';

export class ContactService {
  public async createContact(contactData: ContactRequest, io?: Server | null): Promise<ContactResponse> {
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

      // Emit admin notification for new contact request
      if (io) {
        try {
          await AdminNotificationService.createNotification({
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
        } catch (notifError) {
          console.error('Error creating admin notification for contact:', notifError);
          // Don't fail the contact creation if notification fails
        }
      }

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