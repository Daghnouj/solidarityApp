import { Admin, AdminDocument } from '../admin.model';
import { AdminUpdateDTO, PasswordChangeDTO } from '../admin.types';
import { cloudinary, uploadProfile } from '../../../config/cloudinary/cloudinary';

export class ProfileAdminService {
  static async getAdminProfile(adminId: string): Promise<AdminDocument> {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error('Administrateur non trouvé');
    }
    return admin;
  }

  static async updateAdminProfile(adminId: string, updates: AdminUpdateDTO): Promise<AdminDocument> {
    const admin = await Admin.findByIdAndUpdate(
      adminId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!admin) {
      throw new Error('Administrateur non trouvé');
    }
    
    return admin;
  }

  static async updateAdminPassword(adminId: string, passwordData: PasswordChangeDTO): Promise<{ message: string }> {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error('Administrateur non trouvé');
    }

    const isMatch = await admin.comparePassword(passwordData.oldPassword);
    if (!isMatch) {
      throw new Error('Ancien mot de passe incorrect');
    }

    admin.mdp = passwordData.newPassword;
    await admin.save();

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  static async deleteAdminAccount(adminId: string): Promise<{ message: string }> {
    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
      throw new Error('Administrateur non trouvé');
    }
    return { message: 'Compte administrateur supprimé avec succès' };
  }

  static async updateAdminProfilePhoto(adminId: string, imageFile: Express.Multer.File): Promise<{ photo: string }> {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      throw new Error('Administrateur non trouvé');
    }

    // Supprimer l'ancienne photo si elle existe
    if (admin.photo) {
      const publicId = admin.photo.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`admin_profiles/${publicId}`);
      }
    }

    // Upload nouvelle photo vers Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'admin_profiles',
      transformation: [
        { width: 500, height: 500, crop: 'limit', quality: 'auto' }
      ]
    });

    admin.photo = result.secure_url;
    await admin.save();

    return { photo: admin.photo };
  }
}