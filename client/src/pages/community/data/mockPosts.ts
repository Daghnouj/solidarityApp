// components/community/mockPosts.ts
import type { Post } from "../types";

const now = (offsetMinutes = 0) =>
  new Date(Date.now() - offsetMinutes * 60_000).toISOString();

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    author: "Dr. Ahmed",
    avatar: "/default-avatar.png",
    content: "bonjour",
    likes: 1,
    likedBy: [],
    comments: [],
    hashtags: [],
    bookmarkedBy: [],
    timestamp: now(60 * 24 * 7),
  },
  {
    id: "p2",
    author: "Raouia",
    avatar: "/default-avatar.png",
    content:
      "It's okay to ask for help. Therapy isn't a weakness—it's strength. Every teen deserves a safe space to talk and heal.",
    likes: 3,
    likedBy: [],
    comments: [
      {
        id: "c1",
        author: "Amina",
        text: "Powerful message ❤️",
        timestamp: now(60 * 24 * 3),
      },
    ],
    hashtags: ["teenTherapy", "mentalHealthMatters", "breakthestigma"],
    bookmarkedBy: [],
    timestamp: now(60 * 24 * 2),
  },
  {
    id: "p3",
    author: "Raouia",
    avatar: "/default-avatar.png",
    content:
      "Therapy isn't just for when things fall apart — it's a space to grow, understand, and heal.",
    likes: 0,
    likedBy: [],
    comments: [],
    hashtags: [],
    bookmarkedBy: [],
    timestamp: now(60 * 24 * 1),
  },
];
