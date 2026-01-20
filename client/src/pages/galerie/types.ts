// src/pages/galerie/types.ts

export interface Article {
  id: number;
  title: string;
  image: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  views: number;
  createdAt: string;
  category: string;
}

export type CategoryType = 
  | 'Toutes les catégories'
  | 'Bien-être Mental'
  | 'Gestion du Stress'
  | 'Thérapies et Coaching'
  | 'Relations Sociales'
  | 'Développement Personnel';