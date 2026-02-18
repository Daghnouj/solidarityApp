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
  | 'All Categories'
  | 'Mental Wellbeing'
  | 'Stress Management'
  | 'Therapy & Coaching'
  | 'Social Relations'
  | 'Personal Development';