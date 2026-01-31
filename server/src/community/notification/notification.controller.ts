import { Response } from 'express';
import { ProtectedRequest } from '../../types/express';
import { NotificationService } from './notification.service';

export const getUserNotifications = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const notifications = await NotificationService.getUserNotifications(req.user._id);
    res.json(notifications);
  } catch (error: any) {
    console.error('Erreur récupération notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

export const markAsRead = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    await NotificationService.markAsRead(req.user._id);
    res.json({
      success: true
    });
  } catch (error: any) {
    console.error('Erreur marquage comme lu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

export const markOneAsRead = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await NotificationService.markOneAsRead(req.user._id, id);
    res.json({
      success: true
    });
  } catch (error: any) {
    console.error('Erreur marquage individuel comme lu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

