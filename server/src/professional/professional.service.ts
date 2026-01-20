import { IUser } from '../user/user.types';
import RequestModel from '../request/request.model';
import User from '../user/user.model';
import { IRequest } from '../request/request.types';

export interface ProfessionalWithRequestData extends IUser {
  biographie?: string;
  services?: any[];
  situation_professionnelle?: string;
  intitule_diplome?: string;
  nom_etablissement?: string;
}

export const getAllProfessionalsService = async (
  specialty?: string,
  location?: string,
  search?: string
): Promise<IUser[]> => {
  const query: any = { role: 'professional' };

  if (specialty) query.specialite = specialty;
  if (location) query.adresse = new RegExp(location, 'i');
  
  if (search) {
    query.$or = [
      { nom: new RegExp(search, 'i') },
      { specialite: new RegExp(search, 'i') },
      { bio: new RegExp(search, 'i') }
    ];
  }

  return await User.find(query);
};

export const getFilterOptionsService = async (): Promise<{ specialties: string[], locations: string[] }> => {
  const specialties = await User.distinct('specialite', { role: 'professional' });
  const locations = await User.distinct('adresse', { role: 'professional' });
  
  return { specialties, locations };
};

export const getProfessionalByIdService = async (id: string): Promise<ProfessionalWithRequestData | null> => {
  const professional = await User.findOne({ 
    _id: id,
    role: 'professional' 
  });

  if (!professional) {
    return null;
  }

  const professionalRequest = await RequestModel.findOne({ 
    professional: id 
  });

  const responseData: ProfessionalWithRequestData = {
    ...professional.toObject(),
  };

  if (professionalRequest) {
    responseData.biographie = professionalRequest.biographie;
    responseData.services = professionalRequest.services;
    responseData.situation_professionnelle = professionalRequest.situation_professionnelle;
    responseData.intitule_diplome = professionalRequest.intitule_diplome;
    responseData.nom_etablissement = professionalRequest.nom_etablissement;
  }

  return responseData;
};

export const updateProfessionalServicesService = async (
  professionalId: string,
  services: any[]
): Promise<IRequest> => {
  const professional = await User.findById(professionalId);
  
  if (!professional || professional.role !== 'professional') {
    throw new Error('Professionnel non trouvé');
  }

  const request = await RequestModel.findOneAndUpdate(
    { professional: professionalId },
    { services },
    { new: true, upsert: true }
  );

  return request;
};