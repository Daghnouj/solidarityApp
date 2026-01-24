// auth.service.ts - CORRIGÉ
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import User from "../user/user.model";
import Request from "../request/request.model";
import {
  SignupData,
  LoginData,
  AuthResponse,
  RequestData
} from "./auth.types";
import { CloudinaryFile } from "../../config/cloudinary/cloudinary.types";
import { env } from "../../config/env";
import { AdminNotificationService } from "../admin/adminNotification/adminNotification.service";

class AuthService {
  async signup(userData: SignupData, file: CloudinaryFile | null = null, io?: Server | null): Promise<AuthResponse> {
    console.log('📨 Données reçues dans le service:', userData);

    const {
      nom,
      email,
      mdp,
      dateNaissance,
      adresse,
      telephone,
      role = 'patient', // ✅ Défaut explicite
      specialite,
      situation_professionnelle,
      intitule_diplome,
      nom_etablissement,
      date_obtention_diplome,
      biographie
    } = userData;

    // Validation des champs requis (role n'est plus obligatoire)
    if (!nom || !email || !mdp) {
      throw new Error("Nom, email et mot de passe sont obligatoires.");
    }

    if (!mdp.trim()) {
      throw new Error("Mot de passe requis.");
    }

    // Vérification de l'email unique
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà.");
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(mdp, 12);

    // Création de l'utilisateur
    const userPayload: any = {
      nom,
      email,
      mdp: hashedPassword,
      dateNaissance: dateNaissance ? new Date(dateNaissance) : undefined,
      adresse,
      telephone,
      role, // ✅ Toujours défini maintenant
      is_verified: role === "professional" ? false : true,
    };

    if (role === "professional") {
      if (!specialite) {
        throw new Error("La spécialité est requise pour les professionnels.");
      }
      userPayload.specialite = specialite;
    }

    const user = new User(userPayload);
    await user.save();

    // Emit admin notification for new user signup
    if (io) {
      try {
        await AdminNotificationService.createNotification({
          type: 'user_signup',
          title: 'Nouvel utilisateur inscrit',
          message: `${nom} (${email}) s'est inscrit en tant que ${role === 'professional' ? 'professionnel' : 'patient'}`,
          data: {
            userId: user._id.toString(),
            userName: nom,
            userEmail: email,
            userRole: role
          },
          io
        });
      } catch (notifError) {
        console.error('Error creating admin notification for signup:', notifError);
        // Don't fail the signup if notification fails
      }
    }

    // Gestion des professionnels
    if (role === "professional") {
      if (!file) {
        await User.findByIdAndDelete(user._id);
        throw new Error("Document professionnel requis pour les professionnels.");
      }

      const documentUrl = file.path;

      const requestDoc = new Request({
        professional: user._id,
        specialite,
        situation_professionnelle,
        intitule_diplome,
        nom_etablissement,
        date_obtention_diplome: date_obtention_diplome ? new Date(date_obtention_diplome) : undefined,
        biographie,
        document: documentUrl
      });

      await requestDoc.save();

      return {
        success: true,
        message: "Demande soumise avec succès, en attente de validation.",
        userType: 'professional'
      };
    }

    return {
      success: true,
      message: "Compte patient créé avec succès !",
      userType: 'patient'
    };
  }
  async login(loginData: LoginData, io?: Server | null): Promise<{
    success: boolean;
    token: string;
    role: string;
    user: any;
    message?: string;
  }> {
    const { email, mdp, reactivate } = loginData;

    if (!email || !mdp) {
      throw new Error("Email et mot de passe requis.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    // Vérification du statut du compte
    if (!user.isActive) {
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      if (user.deactivatedAt && user.deactivatedAt > twoMonthsAgo) {
        if (reactivate) {
          user.isActive = true;
          user.deactivatedAt = undefined;
          await user.save();
        } else {
          throw {
            message: "Votre compte est désactivé. Souhaitez-vous le réactiver ?",
            canReactivate: true
          };
        }
      } else {
        throw new Error("Compte désactivé depuis plus de 2 mois. Réactivation impossible.");
      }
    }

    // Vérification du mot de passe
    if (!user.mdp) {
      throw new Error("Problème d'authentification. Contactez l'administrateur.");
    }

    const isMatch = await bcrypt.compare(mdp, user.mdp);
    if (!isMatch) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    // Vérification pour les professionnels
    if (user.role === "professional" && !user.is_verified) {
      throw new Error("Votre compte professionnel est en attente de validation par l'administrateur.");
    }

    // Génération du token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Mise à jour des informations de connexion
    await User.findByIdAndUpdate(user._id, {
      lastLogin: new Date(),
      isOnline: true
    });

    // Retour des informations sans le mot de passe
    const userWithoutPassword = await User.findById(user._id).select('-mdp');

    // Admin notification for user login removed as per request

    return {
      success: true,
      token,
      role: user.role,
      user: userWithoutPassword
    };
  }

  async submitRequest(requestData: RequestData, userId: string, file: CloudinaryFile | null = null, io?: Server | null): Promise<{
    success: boolean;
    message: string;
  }> {
    const {
      specialite,
      situation_professionnelle,
      intitule_diplome,
      nom_etablissement,
      date_obtention_diplome,
      biographie
    } = requestData;

    // Validation des champs requis
    if (!specialite) {
      throw new Error("La spécialité est requise.");
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "professional") {
      throw new Error("Seuls les professionnels peuvent soumettre une demande.");
    }

    // Vérification des demandes existantes
    const existingRequest = await Request.findOne({ professional: userId });
    if (existingRequest) {
      throw new Error("Une demande a déjà été soumise pour ce professionnel.");
    }

    if (!file) {
      throw new Error("Un document est requis pour la soumission.");
    }

    const documentUrl = file.path;

    const requestDoc = new Request({
      professional: userId,
      specialite,
      situation_professionnelle,
      intitule_diplome,
      nom_etablissement,
      date_obtention_diplome: date_obtention_diplome ? new Date(date_obtention_diplome) : undefined,
      biographie,
      document: documentUrl,
    });

    await requestDoc.save();

    // Admin notification for verification request removed as per request

    return {
      success: true,
      message: "Demande soumise avec succès, en attente de validation par l'administrateur."
    };
  }

  async logout(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    await User.findByIdAndUpdate(
      userId,
      {
        isOnline: false,
        lastLogin: new Date()
      },
      { new: true }
    );

    return {
      success: true,
      message: "Déconnexion réussie"
    };
  }

  async getMe(userId: string): Promise<any> {
    const user = await User.findById(userId)
      .select('-mdp -__v')
      .lean();

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return {
      ...user,
      _id: user._id.toString()
    };
  }
}

export default new AuthService();