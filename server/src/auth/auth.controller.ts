import { Request, Response } from 'express';
import authService from "./auth.service";
import { ProtectedRequest } from '../types/express';
import { getIOInstance } from '../socket';

// ✅ Export nommé de chaque fonction
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('=== SIGNUP DEBUG ===');
    console.log('📝 Body reçu:', req.body);
    console.log('📁 Fichier reçu dans controller:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'Aucun fichier');

    const file = req.file;
    const result = await authService.signup(req.body, file, getIOInstance());
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Erreur signup:", error);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body, getIOInstance());
    res.json(result);
  } catch (error: any) {
    console.error("Erreur login:", error);
    if (error.canReactivate) {
      res.status(403).json(error);
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const submitRequest = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const result = await authService.submitRequest(req.body, req.user._id.toString(), file, getIOInstance());
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Erreur submitRequest:", error);
    res.status(400).json({ message: error.message });
  }
};

export const logoutUser = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const result = await authService.logout(req.user._id.toString());
    res.clearCookie("token");
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Erreur logout:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const user = await authService.getMe(req.user._id.toString());
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};