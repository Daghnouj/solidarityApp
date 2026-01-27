import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import User from "./user.model";
import Request from "../request/request.model";
import { UserDocument } from "./user.types";
import { cloudinary } from "../../config/cloudinary/cloudinary";
import {
  UpdateProfileData,
  PasswordData,
  UpdatePhotoResponse,
  DeactivateResponse,
  ActivateResponse,
  UserResponse
} from "./user.types";
import { CloudinaryFile } from "../../config/cloudinary/cloudinary.types";

class UserService {
  async getProfile(userId: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("ID utilisateur invalide");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  }

  async updateProfile(userId: string, updateData: UpdateProfileData): Promise<UserDocument> {
    const {
      email, nom, dateNaissance, adresse, telephone,
      bio, gender, licenseNumber, languages, education, services, clinicName, clinicAddress
    } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        email, nom, dateNaissance, adresse, telephone,
        bio, gender, licenseNumber, languages, education, services, clinicName, clinicAddress
      },
      { new: true }
    ).select("-mdp");

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    // Sync bio with Request biography if bio is updated
    if (bio !== undefined) {
      try {
        await Request.findOneAndUpdate(
          { professional: userId },
          { biographie: bio }
        );
      } catch (error) {
        console.error("Error syncing bio to request:", error);
        // Don't fail the profile update if sync fails, just log it
      }
    }

    return user;
  }

  async updatePassword(userId: string, passwordData: PasswordData): Promise<{ success: boolean; message: string }> {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new Error("Tous les champs sont requis.");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Les nouveaux mots de passe ne correspondent pas.");
    }

    if (newPassword.length < 8) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
    }

    const user = await User.findById(userId).select('+mdp');
    if (!user) {
      throw new Error("Utilisateur non trouvé.");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.mdp!);
    if (!isMatch) {
      throw new Error("Ancien mot de passe incorrect.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(
      userId,
      { mdp: hashedPassword },
      { runValidators: false, context: 'query' } as any
    );

    return {
      success: true,
      message: "Mot de passe mis à jour avec succès."
    };
  }

  async updateProfilePhoto(userId: string, file: CloudinaryFile | undefined): Promise<UpdatePhotoResponse> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (user.photo && user.photo.includes('cloudinary')) {
      try {
        const urlParts = user.photo.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        await cloudinary.uploader.destroy(`profiles/${publicId}`);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'ancienne photo:", error);
      }
    }

    let photoUrl: string | null = null;
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "profiles",
          transformation: [
            { width: 500, height: 500, crop: "limit", quality: "auto" }
          ]
        });
        photoUrl = result.secure_url;
      } catch (uploadError: any) {
        throw new Error("Erreur lors de l'upload de la photo: " + uploadError.message);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photo: photoUrl },
      { new: true }
    ).select("-mdp");

    if (!updatedUser) {
      throw new Error("Erreur lors de la mise à jour de la photo");
    }

    return {
      success: true,
      message: "Photo mise à jour",
      photo: updatedUser.photo || null
    };
  }

  async deleteProfile(userId: string): Promise<{ success: boolean; message: string }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    if (user.photo && user.photo.includes('cloudinary')) {
      try {
        const urlParts = user.photo.split('/');
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        await cloudinary.uploader.destroy(`profiles/${publicId}`);
      } catch (error) {
        console.error("Erreur lors de la suppression de la photo:", error);
      }
    }

    await User.findByIdAndDelete(userId);
    return {
      success: true,
      message: "Compte supprimé avec succès"
    };
  }

  async deactivateAccount(userId: string, password: string | null = null): Promise<DeactivateResponse> {
    if (password) {
      const user = await User.findById(userId);
      if (!user) throw new Error("Utilisateur non trouvé");

      const isMatch = await bcrypt.compare(password, user.mdp!);
      if (!isMatch) throw new Error("Mot de passe incorrect");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isActive: false,
        deactivatedAt: new Date(),
        isOnline: false
      },
      { new: true }
    ).select("-mdp");

    if (!updatedUser) throw new Error("Utilisateur non trouvé");

    return {
      success: true,
      message: "Compte désactivé. Vous avez 2 mois pour le réactiver avant suppression définitive.",
      user: updatedUser,
      deactivatedAt: updatedUser.deactivatedAt!
    };
  }

  async activateAccount(userId: string): Promise<ActivateResponse> {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        isActive: true,
        deactivatedAt: null
      },
      { new: true }
    ).select("-mdp");

    if (!user) throw new Error("Utilisateur non trouvé");

    return {
      success: true,
      message: "Compte activé avec succès.",
      user
    };
  }

  async getUserById(userId: string): Promise<UserResponse> {
    const user = await User.findById(userId).select('-mdp -__v');
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return {
      _id: user._id.toString(),
      nom: user.nom,
      email: user.email,
      dateNaissance: user.dateNaissance,
      adresse: user.adresse,
      telephone: user.telephone,
      photo: user.photo,
      role: user.role,
      is_verified: user.is_verified,
      specialite: user.specialite,
      bio: user.bio,
      gender: user.gender,
      licenseNumber: user.licenseNumber,
      languages: user.languages,
      education: user.education,
      services: user.services,
      clinicName: user.clinicName,
      clinicAddress: user.clinicAddress,
      isOnline: user.isOnline,
      lastLogin: user.lastLogin,
      following: user.following?.map(id => id.toString()),
      groups: user.groups?.map(id => id.toString()),
      saved_specialist: (user as any).saved_specialist?.map((id: any) => id.toString())
    };
  }

  async getCurrentUser(userId: string): Promise<UserResponse> {
    const user = await User.findById(userId)
      .select('-mdp -__v -createdAt -updatedAt');

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return {
      _id: user._id.toString(),
      nom: user.nom,
      email: user.email,
      dateNaissance: user.dateNaissance,
      adresse: user.adresse,
      telephone: user.telephone,
      photo: user.photo || `${process.env.API_BASE_URL}/default-avatar.png`,
      role: user.role,
      is_verified: user.is_verified,
      specialite: user.specialite,
      bio: user.bio,
      gender: user.gender,
      licenseNumber: user.licenseNumber,
      languages: user.languages,
      education: user.education,
      services: user.services,
      clinicName: user.clinicName,
      clinicAddress: user.clinicAddress,
      isOnline: user.isOnline,
      lastLogin: user.lastLogin,
      following: user.following?.map(id => id.toString()),
      groups: user.groups?.map(id => id.toString()),
      saved_specialist: (user as any).saved_specialist?.map((id: any) => id.toString())
    };
  }

  async getSavedSpecialists(userId: string) {
    const user = await User.findById(userId)
      .select('role saved_specialist')
      .populate({
        path: 'saved_specialist',
        match: { role: 'professional' },
        select: '-mdp -__v -stripeCustomerId'
      });
    if (!user) throw new Error('Utilisateur non trouvé');
    if (user.role !== 'patient') throw new Error('Accès réservé aux patients');
    return (user as any).saved_specialist || [];
  }

  async saveSpecialist(userId: string, professionalId: string) {
    const prof = await User.findById(professionalId).select('role');
    if (!prof) throw new Error('Professionnel introuvable');
    if (prof.role !== 'professional') throw new Error('Seuls les professionnels peuvent être sauvegardés');

    const updated = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { saved_specialist: prof._id } },
      { new: true }
    ).select('saved_specialist role');
    if (!updated) throw new Error('Utilisateur non trouvé');
    if (updated.role !== 'patient') throw new Error('Accès réservé aux patients');
    return updated.saved_specialist;
  }

  async unsaveSpecialist(userId: string, professionalId: string) {
    const updated = await User.findByIdAndUpdate(
      userId,
      { $pull: { saved_specialist: professionalId } },
      { new: true }
    ).select('saved_specialist role');
    if (!updated) throw new Error('Utilisateur non trouvé');
    if (updated.role !== 'patient') throw new Error('Accès réservé aux patients');
    return updated.saved_specialist;
  }
}

export default new UserService();