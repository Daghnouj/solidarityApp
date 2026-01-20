import GalerieModel from './gallery.model';
import { 
  IGalerie, 
  CreateGalerieDto, 
  UpdateGalerieDto, 
  GetGaleriesQuery,
  TrackViewRequest 
} from './gallery.types';

export class GalerieService {
  // Créer une nouvelle galerie
  async createGalerie(data: CreateGalerieDto): Promise<IGalerie> {
    if (!data.video) {
      throw new Error('Un lien YouTube est requis');
    }
    
    const galerie = new GalerieModel(data);
    const savedGalerie = await galerie.save();
    
    // Convertir en objet simple pour éviter les problèmes de type
    return savedGalerie.toObject();
  }

  // Obtenir les galeries par catégorie
  async getGaleriesByCategorie(query: GetGaleriesQuery): Promise<IGalerie[]> {
    const filter = query.categorie ? { categorie: query.categorie } : {};
    const galeries = await GalerieModel.find(filter)
      .select('titre desc video categorie views createdAt')
      .lean<IGalerie[]>();
    
    if (!galeries.length) {
      throw new Error('Aucune galerie trouvée');
    }
    
    return galeries;
  }

  // Obtenir une galerie par ID
  async getGalerieById(id: string): Promise<IGalerie | null> {
    const galerie = await GalerieModel.findById(id).lean<IGalerie>();
    return galerie;
  }

  // Mettre à jour une galerie
  async updateGalerie(id: string, data: UpdateGalerieDto): Promise<IGalerie | null> {
    const galerie = await GalerieModel.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    ).lean<IGalerie>();
    
    return galerie;
  }

  // Supprimer une galerie
  async deleteGalerie(id: string): Promise<boolean> {
    const result = await GalerieModel.findByIdAndDelete(id);
    return result !== null;
  }

  // Obtenir le nombre total de vidéos
  async getTotalVideos(categorie?: string): Promise<number> {
    const filter = categorie ? { categorie } : {};
    return await GalerieModel.countDocuments(filter);
  }

  // Tracker une vue
  async trackView(data: TrackViewRequest): Promise<number> {
    const { id, user, ip, headers } = data;
    const galerie = await GalerieModel.findById(id);
    
    if (!galerie) {
      throw new Error('Vidéo non trouvée');
    }

    // Initialiser viewedBy s'il n'existe pas
    if (!galerie.viewedBy) {
      galerie.viewedBy = [];
    }

    if (user) {
      const userId = user._id.toString();
      const hasViewed = galerie.viewedBy.some(view => 
        view.type === 'user' && view.id === userId
      );

      if (!hasViewed) {
        galerie.viewedBy.push({
          type: 'user',
          id: userId,
          ip,
          device: headers['user-agent'],
          date: new Date()
        });
        galerie.views += 1;
      }
    } else {
      const hasViewed = galerie.viewedBy.some(view =>
        view.type === 'anon' && view.ip === ip && view.device === headers['user-agent']
      );

      if (!hasViewed) {
        galerie.viewedBy.push({
          type: 'anon',
          ip,
          device: headers['user-agent'],
          date: new Date()
        });
        galerie.views += 1;
      }
    }

    await galerie.save();
    return galerie.views;
  }
}

export default new GalerieService();