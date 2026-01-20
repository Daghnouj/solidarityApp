import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  DashboardState, 
  UserRow,
  Appointment,
  MoodStats,
  TherapyProgress,
  CommunityPost
} from '../types';

// Extended state with all dashboard features
interface ExtendedDashboardState extends DashboardState {
  moodStats: MoodStats | null;
  appointments: Appointment[];
  therapyProgress: TherapyProgress | null;
  communityPosts: CommunityPost[];
}

const initialState: ExtendedDashboardState = {
  users: [],
  totalUsers: 0,
  loading: false,
  error: null,
  moodStats: null,
  appointments: [],
  therapyProgress: null,
  communityPosts: [],
};

// Async Thunks for API calls

// Fetch Users
export const fetchUsers = createAsyncThunk(
  'dashboard/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/users?limit=10');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      return data as { users: UserRow[]; total: number };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch users');
    }
  }
);

// Fetch Mood Statistics
export const fetchMoodStats = createAsyncThunk(
  'dashboard/fetchMoodStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/mood/stats');
      if (!res.ok) throw new Error('Failed to fetch mood stats');
      const data = await res.json();
      return data as MoodStats;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch mood stats');
    }
  }
);

// Fetch Appointments
export const fetchAppointments = createAsyncThunk(
  'dashboard/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/appointments?upcoming=true');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      return data.appointments as Appointment[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch appointments');
    }
  }
);

// Fetch Therapy Progress
export const fetchTherapyProgress = createAsyncThunk(
  'dashboard/fetchTherapyProgress',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/therapy/progress');
      if (!res.ok) throw new Error('Failed to fetch therapy progress');
      const data = await res.json();
      return data as TherapyProgress;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch therapy progress');
    }
  }
);

// Fetch Community Posts
export const fetchCommunityPosts = createAsyncThunk(
  'dashboard/fetchCommunityPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/community/highlights?limit=5');
      if (!res.ok) throw new Error('Failed to fetch community posts');
      const data = await res.json();
      return data.posts as CommunityPost[];
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch community posts');
    }
  }
);

// Fetch all dashboard data at once
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchAll',
  async (_, { dispatch }) => {
    // Dispatch all fetch actions in parallel
    await Promise.all([
      dispatch(fetchUsers()),
      dispatch(fetchMoodStats()),
      dispatch(fetchAppointments()),
      dispatch(fetchTherapyProgress()),
      dispatch(fetchCommunityPosts()),
    ]);
  }
);

// Dashboard Slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Clear error
    clearDashboardError(state) {
      state.error = null;
    },

    // Update mood stats locally (optimistic update)
    updateMoodStats(state, action: PayloadAction<MoodStats>) {
      state.moodStats = action.payload;
    },

    // Add new appointment locally
    addAppointment(state, action: PayloadAction<Appointment>) {
      state.appointments.unshift(action.payload);
    },

    // Remove appointment
    removeAppointment(state, action: PayloadAction<string>) {
      state.appointments = state.appointments.filter(
        apt => apt.id !== action.payload
      );
    },

    // Update therapy goal progress
    updateGoalProgress(
      state,
      action: PayloadAction<{ goalId: string; progress: number }>
    ) {
      if (state.therapyProgress) {
        const goal = state.therapyProgress.goals.find(
          g => g.id === action.payload.goalId
        );
        if (goal) {
          goal.progress = action.payload.progress;
        }
      }
    },

    // Like community post
    togglePostLike(state, action: PayloadAction<string>) {
      const post = state.communityPosts.find(p => p.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
    },

    // Reset dashboard state
    resetDashboard() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<{ users: UserRow[]; total: number }>) => {
          state.loading = false;
          state.users = action.payload.users;
          state.totalUsers = action.payload.total;
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Mood Stats
    builder
      .addCase(fetchMoodStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMoodStats.fulfilled, (state, action: PayloadAction<MoodStats>) => {
        state.loading = false;
        state.moodStats = action.payload;
      })
      .addCase(fetchMoodStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Appointments
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAppointments.fulfilled,
        (state, action: PayloadAction<Appointment[]>) => {
          state.loading = false;
          state.appointments = action.payload;
        }
      )
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Therapy Progress
    builder
      .addCase(fetchTherapyProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchTherapyProgress.fulfilled,
        (state, action: PayloadAction<TherapyProgress>) => {
          state.loading = false;
          state.therapyProgress = action.payload;
        }
      )
      .addCase(fetchTherapyProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Community Posts
    builder
      .addCase(fetchCommunityPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCommunityPosts.fulfilled,
        (state, action: PayloadAction<CommunityPost[]>) => {
          state.loading = false;
          state.communityPosts = action.payload;
        }
      )
      .addCase(fetchCommunityPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch All Dashboard Data
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchDashboardData.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to load dashboard data';
      });
  },
});

// Export actions
export const {
  clearDashboardError,
  updateMoodStats,
  addAppointment,
  removeAppointment,
  updateGoalProgress,
  togglePostLike,
  resetDashboard,
} = dashboardSlice.actions;

// Export reducer
export default dashboardSlice.reducer;