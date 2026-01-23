import { Request, Response } from 'express';
import { AdminOverviewService } from './adminOverview.service';

export class AdminOverviewController {
  static async getOverview(req: Request, res: Response) {
    try {
      const overviewData = await AdminOverviewService.getOverviewData();
      res.status(200).json(overviewData);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Erreur lors de la récupération des données de l\'aperçu',
        error: error.message 
      });
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: 'Le paramètre de requête est requis et doit être une chaîne.' });
      }
      const searchResult = await AdminOverviewService.searchAll(query);
      res.status(200).json(searchResult);
    } catch (error: any) {
      res.status(500).json({ 
        message: error.message || 'Erreur lors de la recherche',
        error: error.message 
      });
    }
  }
}