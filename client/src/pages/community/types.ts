// components/community/types.ts
export interface Reply {
  _id: string;
  user: {
    _id: string;
    nom: string;
    photo?: string;
    role?: string;
  };
  text: string;
  date: string;
}

export interface Comment {
  _id: string;
  user: {
    _id: string;
    nom: string;
    photo?: string;
    role?: string;
  };
  text: string;
  date: string;
  replies?: Reply[];
}

export interface Post {
  _id: string;
  username: string;
  userPhoto?: string;
  userRole: string;
  content: string;
  likes: number;
  likedBy: (string | { _id: string; nom: string; photo?: string; role: string })[]; // can be ids or populated objects
  comments: Comment[];
  hashtags?: string[];
  favorites: string[]; // array of user ids
  date: string;
  user?: {
    _id: string;
    nom: string;
    photo?: string;
    role: string;
  };
}
