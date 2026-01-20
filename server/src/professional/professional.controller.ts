import { Request, Response } from 'express';
import { 
  getAllProfessionalsService, 
  getFilterOptionsService, 
  getProfessionalByIdService, 
  updateProfessionalServicesService 
} from './professional.service';
import mongoose from 'mongoose';

export const getAllProfessionals = async (req: Request, res: Response): Promise<void> => {
  try {
    const { specialty, location, search } = req.query;
    const professionals = await getAllProfessionalsService(
      specialty as string,
      location as string,
      search as string
    );
    res.status(200).json(professionals);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const filterOptions = await getFilterOptionsService();
    res.status(200).json(filterOptions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfessionalById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Format d\'ID invalide' });
      return;
    }

    const professional = await getProfessionalByIdService(id);
    
    if (!professional) {
      res.status(404).json({ message: 'Professionnel non trouvé' });
      return;
    }

    res.status(200).json(professional);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfessionalServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { professionalId } = req.params;
    const { services } = req.body;

    const updatedRequest = await updateProfessionalServicesService(professionalId, services);
    res.status(200).json(updatedRequest);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};