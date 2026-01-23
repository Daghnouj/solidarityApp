import { Server } from 'socket.io';
import User from '../../user/user.model'; 
import Request from '../../request/request.model'; 
import { emailService } from '../../email/email.service';
import { AdminNotificationService } from '../adminNotification/adminNotification.service';

export class VerificationService {
  static async verifyProfessional(professionalId: string, io?: Server | null) {
    const user = await User.findByIdAndUpdate(
      professionalId,
      { 
        is_verified: true,
        verification_status: 'approved',
        rejection_reason: null
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Utilisation du service d'email
    await emailService.sendVerificationEmail(user.email, user.nom);

    // Emit admin notification for verification update
    if (io) {
      try {
        await AdminNotificationService.createNotification({
          type: 'verification_update',
          title: 'Professionnel vérifié',
          message: `${user.nom} (${user.email}) a été vérifié avec succès`,
          data: {
            professionalId: user._id.toString(),
            professionalName: user.nom,
            professionalEmail: user.email,
            status: 'approved'
          },
          io
        });
      } catch (notifError) {
        console.error('Error creating admin notification for verification:', notifError);
      }
    }

    return user;
  }

  static async getUnverifiedProfessionalsRequests() {
    const requests = await Request.find()
      .populate({
        path: 'professional',
        match: { 
          is_verified: false,
          role: 'professional'
        },
        select: '-mdp'
      })
      .exec();

    return requests.filter(request => request.professional !== null);
  }

  static async getAllRequests() {
    const requests = await Request.find()
      .populate({
        path: 'professional',
        match: { role: 'professional' },
        select: '-mdp'
      })
      .sort({ createdAt: -1 })
      .exec();

    return requests.filter(request => request.professional !== null);
  }

  static async getRequestById(requestId: string) {
    const request = await Request.findById(requestId)
      .populate({
        path: 'professional',
        select: '-mdp'
      })
      .exec();

    if (!request) {
      throw new Error('Requête non trouvée');
    }

    return request;
  }

  static async rejectProfessional(professionalId: string, reason: string, io?: Server | null) {
    const user = await User.findByIdAndUpdate(
      professionalId,
      { 
        is_verified: false,
        verification_status: 'rejected',
        rejection_reason: reason
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Utilisation du service d'email
    await emailService.sendRejectionEmail(user.email, user.nom, reason);

    // Emit admin notification for verification rejection
    if (io) {
      try {
        await AdminNotificationService.createNotification({
          type: 'verification_update',
          title: 'Professionnel rejeté',
          message: `${user.nom} (${user.email}) a été rejeté: ${reason}`,
          data: {
            professionalId: user._id.toString(),
            professionalName: user.nom,
            professionalEmail: user.email,
            status: 'rejected',
            rejectionReason: reason
          },
          io
        });
      } catch (notifError) {
        console.error('Error creating admin notification for rejection:', notifError);
      }
    }

    return user;
  }

  static async getProfessionalDetails(professionalId: string) {
    const user = await User.findById(professionalId).select('-mdp');

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }
}