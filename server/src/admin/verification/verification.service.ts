import User from '../../user/user.model'; 
import Request from '../../request/request.model'; 
import { emailService } from '../../email/email.service';

export class VerificationService {
  static async verifyProfessional(professionalId: string) {
    const user = await User.findByIdAndUpdate(
      professionalId,
      { is_verified: true },
      { new: true }
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

  static async rejectProfessional(professionalId: string, reason: string) {
    const user = await User.findByIdAndUpdate(
      professionalId,
      { 
        is_verified: false,
        verification_status: 'rejected',
        rejection_reason: reason
      },
      { new: true }
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