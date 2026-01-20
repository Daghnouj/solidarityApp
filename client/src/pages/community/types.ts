// components/community/types.ts
export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  likes: number;
  likedBy: string[]; // array of user ids
  comments: Comment[];
  hashtags?: string[];
  bookmarkedBy: string[]; // array of user ids
  timestamp: string;
}
