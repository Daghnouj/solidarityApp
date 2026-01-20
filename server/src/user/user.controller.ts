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
    // Pour admin seulement - vérifier les permissions
    const users = await User.find()
      .select('-mdp -__v -stripeCustomerId')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: users
    });
  } catch (error: any) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};