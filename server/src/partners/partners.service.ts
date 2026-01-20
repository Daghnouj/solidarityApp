import { Partenaire } from './partners.model';
import { 
  CreatePartenaireDto, 
  UpdatePartenaireDto, 
  IPartenaire 
} from './partners.types';
import { cloudinary } from '../../config/cloudinary/cloudinary';
import { CloudinaryFile } from '../../config/cloudinary/cloudinary.types'; // Import ajouté

export class PartenaireService {
  async createPartenaire(data: CreatePartenaireDto, file?: CloudinaryFile): Promise<IPartenaire> {
    // Vérifier si un partenaire avec cet email existe déjà
    const existing = await Partenaire.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new Error('Un partenaire avec cet email existe déjà.');
    }

    const partenaireData: any = { ...data };
    
    // Gérer l'upload Cloudinary si un fichier est fourni
    if (file && file.path) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'partenaires/logos',
        transformation: [
          { width: 300, height: 300, crop: 'limit', quality: 'auto' }
        ]
      });
      
      partenaireData.logo = {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      };
    }

    const partenaire = new Partenaire(partenaireData);
    return await partenaire.save();
  }

  async getAllPartenaires(): Promise<IPartenaire[]> {
    return await Partenaire.find().sort({ createdAt: -1 });
  }

  async getPartenaireById(id: string): Promise<IPartenaire | null> {
    return await Partenaire.findById(id);
  }

  async updatePartenaire(
    id: string, 
    data: UpdatePartenaireDto, 
    file?: CloudinaryFile // Type corrigé
  ): Promise<IPartenaire | null> {
    const partenaire = await Partenaire.findById(id);
    if (!partenaire) {
      throw new Error('Partenaire non trouvé');
    }

    // Si un nouveau logo est uploadé
    if (file && file.path) {
      // Supprimer l'ancien logo de Cloudinary s'il existe
      if (partenaire.logo?.public_id) {
        await cloudinary.uploader.destroy(partenaire.logo.public_id);
      }

      // Uploader le nouveau logo
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'partenaires/logos',
        transformation: [
          { width: 300, height: 300, crop: 'limit', quality: 'auto' }
        ]
      });

      data.logo = {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
      };
    }

    return await Partenaire.findByIdAndUpdate(id, data, { 
      new: true, 
      runValidators: true 
    });
  }

  async deletePartenaire(id: string): Promise<IPartenaire | null> {
    const partenaire = await Partenaire.findById(id);
    if (!partenaire) {
      throw new Error('Partenaire non trouvé');
    }

    // Supprimer le logo de Cloudinary s'il existe
    if (partenaire.logo?.public_id) {
      await cloudinary.uploader.destroy(partenaire.logo.public_id);
    }

    return await Partenaire.findByIdAndDelete(id);
  }
}