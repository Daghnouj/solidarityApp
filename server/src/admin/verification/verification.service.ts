import User from '../../user/user.model'; 
import Request from '../../request/request.model'; 
import { emailService } from '../../email/email.service';

export class VerificationService {
  static async verifyProfessional(professionalId: string) {
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

  static async rejectProfessional(professionalId: string, reason: string) {
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