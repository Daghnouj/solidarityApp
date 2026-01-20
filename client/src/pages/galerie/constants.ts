// src/pages/galerie/constants.ts

import gg1 from '../../assets/gg1.jpeg';
import gg2 from '../../assets/gg2.jpeg';
import gg3 from '../../assets/gg3.jpeg';
import gg4 from '../../assets/gg4.jpeg';
import type { Article, Video, CategoryType } from './types';

export const CATEGORIES: CategoryType[] = [
  'Toutes les catégories',
  'Bien-être Mental',
  'Gestion du Stress',
  'Thérapies et Coaching',
  'Relations Sociales',
  'Développement Personnel',
];

export const ARTICLES: Article[] = [
  { id: 1, title: 'Anxiety Triggers', image: gg1 },
  { id: 2, title: 'Digital Detox', image: gg2 },
  { id: 3, title: 'Sleep Psychology', image: gg3 },
  { id: 4, title: 'Mindful Living', image: gg4 },
];

// Mock video data - Replace with actual backend data
export const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Understanding Anxiety and Stress Management',
    description: 'Learn effective techniques to manage anxiety and stress in daily life',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 1234,
    createdAt: '2024-01-15T10:00:00Z',
    category: 'Bien-être Mental',
  },
  {
    id: '2',
    title: 'Mindfulness Meditation for Beginners',
    description: 'A comprehensive guide to starting your mindfulness practice',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 2567,
    createdAt: '2024-01-20T14:30:00Z',
    category: 'Développement Personnel',
  },
  {
    id: '3',
    title: 'Building Healthy Relationships',
    description: 'Expert advice on maintaining strong and healthy relationships',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 890,
    createdAt: '2024-02-01T09:15:00Z',
    category: 'Relations Sociales',
  },
  {
    id: '4',
    title: 'Cognitive Behavioral Therapy Basics',
    description: 'Introduction to CBT techniques and how they can help',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 3421,
    createdAt: '2024-02-10T16:45:00Z',
    category: 'Thérapies et Coaching',
  },
  {
    id: '5',
    title: 'Managing Work-Life Balance',
    description: 'Strategies for maintaining balance between work and personal life',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 1876,
    createdAt: '2024-02-15T11:20:00Z',
    category: 'Gestion du Stress',
  },
  {
    id: '6',
    title: 'Sleep Hygiene and Mental Health',
    description: 'The connection between quality sleep and mental wellbeing',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    views: 2109,
    createdAt: '2024-02-20T13:00:00Z',
    category: 'Bien-être Mental',
  },
];

export const BLOG_URL = 'https://solidarity-mentalhealth.blogspot.com';