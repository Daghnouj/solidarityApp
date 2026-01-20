// User Management Types
export interface UserRow {
  id: string;
  name: string;
  email: string;
  role?: 'User' | 'Therapist' | 'Admin';
  createdAt?: string;
  avatar?: string;
}

// Dashboard State
export interface DashboardState {
  users: UserRow[];
  totalUsers: number;
  loading: boolean;
  error?: string | null;
}

// Mood Tracking Types
export interface MoodEntry {
  id: string;
  date: string;
  score: number; // 1-10
  note?: string;
  activities?: string[];
}

export interface MoodStats {
  average: number;
  trend: 'up' | 'down' | 'stable';
  bestDay: string;
  weeklyData: number[];
}

// Appointment Types
export interface Appointment {
  id: string;
  therapistId: string;
  therapistName: string;
  therapistAvatar?: string;
  type: 'CBT' | 'Mindfulness' | 'Consultation' | 'Group' | 'Other';
  date: string;
  time: string;
  duration: number; // in minutes
  mode: 'video' | 'in-person' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  isUrgent?: boolean;
  notes?: string;
}

// Therapy Progress Types
export interface TherapyGoal {
  id: string;
  label: string;
  description?: string;
  progress: number; // 0-100
  target: number; // 0-100
  color: 'blue' | 'orange' | 'teal' | 'purple';
  startDate: string;
  targetDate?: string;
}

export interface TherapyProgress {
  goals: TherapyGoal[];
  overallProgress: number;
  sessionsCompleted: number;
  totalSessions: number;
}

// Community Types
export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  type: 'success' | 'resource' | 'milestone' | 'question';
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

// Statistics Types
export interface Statistic {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: 'blue' | 'orange' | 'teal' | 'purple';
}

// Notification Types
export interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'achievement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// Extended Dashboard State with all features
export interface ExtendedDashboardState extends DashboardState {
  moodStats: MoodStats | null;
  appointments: Appointment[];
  therapyProgress: TherapyProgress | null;
  communityPosts: CommunityPost[];
  notifications: Notification[];
  statistics: Statistic[];
}