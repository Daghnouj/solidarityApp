import { Schema, model } from 'mongoose';
import { IGalerie, IView } from './gallery.types';

const ViewSchema = new Schema<IView>({
  type: { 
    type: String, 
    enum: ['user', 'anon'], 
    required: true 
  },
  id: { 
    type: String 
  },
  ip: { 
    type: String, 
    required: true 
  },
  device: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

const GalerieSchema = new Schema<IGalerie>({
  titre: { 
    type: String, 
    required: [true, 'Le titre est requis'], 
    unique: true, 
    sparse: true 
  },
  desc: { 
    type: String, 
    required: [true, 'La description est requise'] 
  },
  video: { 
    type: String, 
    required: [true, 'Le lien video est requis'] 
  },
  categorie: { 
    type: String, 
    required: true,
    enum: [  
      "Bien-être Mental",
      "Gestion du Stress", 
      "Thérapies et Coaching",
      "Relations Sociales",
      "Développement Personnel"
    ] 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  viewedBy: {
    type: [ViewSchema],
    default: []
  }
});

// Ajouter des index
GalerieSchema.index({ categorie: 1 });
GalerieSchema.index({ createdAt: -1 });

export default model<IGalerie>('Galerie', GalerieSchema);