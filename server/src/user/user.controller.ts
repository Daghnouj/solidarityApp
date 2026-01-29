import { Request, Response } from 'express';
import userService from "./user.service";
import { ProtectedRequest } from '../types/express';
import User from './user.model';

export const getProfile = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    // Pour /profile/me → req.user._id, pour /profile/:userId → req.params.userId
    const userId = req.params.userId || req.user._id.toString();
    const user = await userService.getProfile(userId);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('Erreur getProfile:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getSavedSpecialists = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user._id.toString();
    const specialists = await userService.getSavedSpecialists(userId);
    res.json({ success: true, data: specialists });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const saveSpecialist = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user._id.toString();
    const { professionalId } = req.params;
    const list = await userService.saveSpecialist(userId, professionalId);
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const unsaveSpecialist = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user._id.toString();
    const { professionalId } = req.params;
    const list = await userService.unsaveSpecialist(userId, professionalId);
    res.json({ success: true, data: list });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await userService.updateProfile(userId, req.body);
    res.json({
      success: true,
      data: user,
      message: "Profil mis à jour avec succès"
    });
  } catch (error: any) {
    console.error("Erreur updateProfile:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const result = await userService.updatePassword(userId, req.body);
    res.json(result);
  } catch (error: any) {
    console.error("Erreur updatePassword:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const updateProfilePhoto = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Aucune image fournie"
      });
      return;
    }

    const result = await userService.updateProfilePhoto(userId, req.file as any);
    res.json(result);
  } catch (error: any) {
    console.error("Erreur updateProfilePhoto:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const result = await userService.deleteProfile(userId);
    res.json(result);
  } catch (error: any) {
    console.error("Erreur deleteProfile:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const deactivateAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const result = await userService.deactivateAccount(userId, req.body.password);
    res.json(result);
  } catch (error: any) {
    console.error("Erreur deactivateAccount:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const activateAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const result = await userService.activateAccount(userId);
    res.json(result);
  } catch (error: any) {
    console.error("Erreur activateAccount:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('[USER] Erreur:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

export const getPublicProfessional = async (req: Request, res: Response): Promise<void> => {
  try {
    const professional = await User.findById(req.params.id)
      .select('-mdp -__v -stripeCustomerId');

    if (!professional) {
      res.status(404).json({
        success: false,
        message: 'Professional not found'
      });
      return;
    }

    // Only return if it's an active, verified professional
    if (professional.role !== 'professional' || !professional.isActive || !professional.is_verified) {
      res.status(404).json({
        success: false,
        message: 'Professional not found'
      });
      return;
    }

    res.json({
      success: true,
      data: professional
    });
  } catch (error: any) {
    console.error('[PUBLIC PROFESSIONAL] Erreur:', error);
    res.status(404).json({
      success: false,
      message: 'Professional not found'
    });
  }
};


export const getCurrentUser = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const user = await userService.getCurrentUser(req.user._id.toString());
    res.json({
      success: true,
      data: user
    });
  } catch (error: any) {
    console.error('[CURRENT USER] Erreur:', error);
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Admin-only endpoint - check if requester is admin
    const isAdmin = (req as any).isAdmin;

    if (!isAdmin) {
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
      return;
    }
    // Public listing with optional filters/pagination for professionals directory
    const {
      role,
      page = '1',
      limit = '12',
      search = '',
      specialty = '',
      sort = 'latest' // name_asc, name_desc, latest
    } = req.query as Record<string, string>;

    const pageNum = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit as string, 10) || 12, 1), 100);

    const filter: any = {};

    // For non-admin users, only show active professionals
    if (!isAdmin) {
      filter.role = 'professional';
      filter.isActive = true;
      filter.is_verified = true; // Only show verified professionals publicly
    } else {
      // Admins can filter by role if specified
      if (role) filter.role = role;
    }

    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { specialite: { $regex: search, $options: 'i' } }
      ];
    }
    if (specialty) {
      filter.specialite = { $regex: `^${specialty}$`, $options: 'i' };
    }

    let sortBy: any = { createdAt: -1 };
    if (sort === 'name_asc') sortBy = { nom: 1 };
    else if (sort === 'name_desc') sortBy = { nom: -1 };
    else if (sort === 'latest') sortBy = { createdAt: -1 };

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .select('-mdp -__v -stripeCustomerId')
        .sort(sortBy)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
    ]);

    res.json({
      success: true,
      data: users,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error: any) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};