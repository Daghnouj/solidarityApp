export interface Activity {
  name: string;
  day: string;
}

export interface ActivityCenter {
  _id: string;
  name: string;
  address: string;
  description: string;
  images: string[];
  coordinates?: string;
  activities: Activity[];
  website?: string;
  category?: string;
  phone?: string;
  email?: string;
  participants: string[];
  averageRating: number;
  numberOfRatings: number;
}

export interface LightboxState {
  isOpen: boolean;
  selectedCenter: ActivityCenter | null;
  currentImageIndex: number;
}