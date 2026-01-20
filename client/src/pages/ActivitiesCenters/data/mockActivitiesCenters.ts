import type { ActivityCenter } from '../types';

export const mockActivitiesCenters: ActivityCenter[] = [
  {
    _id: '1',
    name: 'Yoga Center Tunis',
    address: 'Avenue Habib Bourguiba, Tunis',
    description: 'Professional yoga and meditation center with certified instructors. Perfect for stress relief and physical wellness.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500'
    ],
    coordinates: '36.8065,10.1815',
    activities: [
      { name: 'Yoga', day: 'Monday, Wednesday' },
      { name: 'Meditation', day: 'Tuesday, Thursday' },
      { name: 'Pilates', day: 'Friday, Saturday' }
    ]
  },
  {
    _id: '2',
    name: 'Fitness Club Sousse',
    address: 'Zone Touristique, Sousse',
    description: 'Modern fitness facility with state-of-the-art equipment and professional trainers.',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'
    ],
    coordinates: '35.8288,10.6405',
    activities: [
      { name: 'Cardio', day: 'Daily' },
      { name: 'Strength Training', day: 'Monday, Wednesday, Friday' },
      { name: 'Zumba', day: 'Tuesday, Thursday' }
    ]
  },
  {
    _id: '3',
    name: 'Wellness Spa Hammamet',
    address: 'Hammamet Nord',
    description: 'Luxury wellness center offering spa treatments, massage therapy, and relaxation sessions.',
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    coordinates: '36.4000,10.6167',
    activities: [
      { name: 'Massage Therapy', day: 'Monday - Saturday' },
      { name: 'Spa Treatments', day: 'Daily' },
      { name: 'Aromatherapy', day: 'Wednesday, Friday' }
    ]
  },
  {
    _id: '4',
    name: 'Sports Complex Tunis',
    address: 'Lac de Tunis',
    description: 'Comprehensive sports complex with multiple courts, swimming pool, and fitness classes.',
    images: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500',
      'https://images.unsplash.com/photo-1536922246289-88c42f957773?w=500'
    ],
    coordinates: '36.8381,10.2403',
    activities: [
      { name: 'Swimming', day: 'Daily' },
      { name: 'Tennis', day: 'Monday, Wednesday, Friday' },
      { name: 'Basketball', day: 'Tuesday, Thursday' }
    ]
  },
  {
    _id: '5',
    name: 'Mindfulness Center Carthage',
    address: 'Carthage, Tunis',
    description: 'Center dedicated to mental wellness through mindfulness practices and therapy sessions.',
    images: [
      'https://images.unsplash.com/photo-1593811167562-9cef47bf5a07?w=500',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500'
    ],
    coordinates: '36.8528,10.3233',
    activities: [
      { name: 'Mindfulness', day: 'Monday, Thursday' },
      { name: 'Therapy Sessions', day: 'Tuesday, Friday' },
      { name: 'Group Counseling', day: 'Wednesday' }
    ]
  },
  {
    _id: '6',
    name: 'Adventure Club Bizerte',
    address: 'Cap Blanc, Bizerte',
    description: 'Outdoor adventure center offering water sports, hiking, and team building activities.',
    images: [
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=500',
      'https://images.unsplash.com/photo-1464822759844-d62ed505c1f8?w=500'
    ],
    coordinates: '37.2747,9.8739',
    activities: [
      { name: 'Water Sports', day: 'Weekends' },
      { name: 'Hiking', day: 'Saturday, Sunday' },
      { name: 'Team Building', day: 'By Appointment' }
    ]
  }
  
  
];