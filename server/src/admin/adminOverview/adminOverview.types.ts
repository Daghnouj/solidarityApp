export interface AdminOverviewData {
  // Statistiques générales
  totalUsers: number;
  totalPatients: number;
  totalProfessionals: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalEvents: number;
  totalGalleryItems: number;
  totalContacts: number;
  totalPartners: number;
  totalRequests: number;
  totalAdmins: number;
  
  // Statistiques de vérification
  verificationStats: {
    pending: number;
    approved: number;
    rejected: number;
  };
  
  // Statistiques d'activité utilisateurs
  activeUsers: {
    online: number;
    offline: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  
  // Statistiques de posts
  postsStats: {
    totalHashtags: number;
    topHashtags: { hashtag: string; count: number }[];
    postsThisWeek: number;
    postsThisMonth: number;
  };
  
  // Statistiques de galerie
  galleryStats: {
    totalViews: number;
    byCategory: { category: string; count: number; views: number }[];
  };
  
  // Utilisateurs les plus actifs
  mostActiveUsers: {
    _id: string;
    nom: string;
    email: string;
    role: string;
    postCount: number;
    commentCount: number;
    totalLikes: number;
  }[];
  
  // Posts récents
  recentlyCreatedPosts: {
    _id: string;
    content: string;
    username: string;
    userRole: string;
    likes: number;
    commentsCount: number;
    date: Date;
  }[];
  
  // Admins récents
  recentlyCreatedAdmins: {
    _id: string;
    nom: string;
    email: string;
    phone?: string;
    date: Date;
  }[];
  
  // Demandes de vérification en attente
  pendingVerifications: {
    _id: string;
    professional: {
      _id: string;
      nom: string;
      email: string;
      specialite: string;
    };
    specialite: string;
    createdAt: Date;
  }[];
  
  // Contacts récents
  recentContacts: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    createdAt: Date;
  }[];
  
  // Statistiques temporelles
  timeline: {
    today: {
      users: number;
      posts: number;
      contacts: number;
    };
    thisWeek: {
      users: number;
      posts: number;
      contacts: number;
    };
    thisMonth: {
      users: number;
      posts: number;
      contacts: number;
    };
  };
}

export interface AdminSearchResult {
  users: {
    _id: string;
    nom: string;
    email: string;
    role: string;
    is_verified: boolean;
  }[];
  posts: {
    _id: string;
    content: string;
    username: string;
    userRole: string;
    likes: number;
    date: Date;
  }[];
  admins: {
    _id: string;
    nom: string;
    email: string;
    phone?: string;
    createdAt: Date;
  }[];
  events: {
    _id: string;
    name: string;
    address: string;
    category: string;
    createdAt: Date;
  }[];
  gallery: {
    _id: string;
    titre: string;
    categorie: string;
    views: number;
    createdAt: Date;
  }[];
  contacts: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    createdAt: Date;
  }[];
  partners: {
    _id: string;
    nom: string;
    email: string;
    service: string;
    createdAt: Date;
  }[];
  requests: {
    _id: string;
    specialite: string;
    professional: string;
    createdAt: Date;
  }[];
}