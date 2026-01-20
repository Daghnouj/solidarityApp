import { useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  fetchDashboardData,
  fetchUsers,
  fetchMoodStats,
  fetchAppointments,
  fetchTherapyProgress,
  fetchCommunityPosts,
  clearDashboardError,
  updateGoalProgress,
  togglePostLike,
  addAppointment,
  removeAppointment,
} from '../features/dashboardSlice';
import type { Appointment } from '../types';

/**
 * Custom hook for dashboard data management
 * Provides data, loading states, and helper functions
 */
export const useDashboard = () => {
  const dispatch = useAppDispatch();

  // Select all dashboard state
  const {
    users,
    totalUsers,
    loading,
    error,
    moodStats,
    appointments,
    therapyProgress,
    communityPosts,
  } = useAppSelector((state) => state.dashboard);

  // Fetch all dashboard data on mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Refresh specific sections
  const refreshUsers = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const refreshMoodStats = useCallback(() => {
    dispatch(fetchMoodStats());
  }, [dispatch]);

  const refreshAppointments = useCallback(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const refreshTherapyProgress = useCallback(() => {
    dispatch(fetchTherapyProgress());
  }, [dispatch]);

  const refreshCommunityPosts = useCallback(() => {
    dispatch(fetchCommunityPosts());
  }, [dispatch]);

  // Refresh all data
  const refreshAll = useCallback(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Clear errors
  const clearError = useCallback(() => {
    dispatch(clearDashboardError());
  }, [dispatch]);

  // Update therapy goal progress
  const updateGoal = useCallback(
    (goalId: string, progress: number) => {
      dispatch(updateGoalProgress({ goalId, progress }));
    },
    [dispatch]
  );

  // Like/unlike community post
  const likePost = useCallback(
    (postId: string) => {
      dispatch(togglePostLike(postId));
    },
    [dispatch]
  );

  // Add new appointment
  const createAppointment = useCallback(
    (appointment: Appointment) => {
      dispatch(addAppointment(appointment));
    },
    [dispatch]
  );

  // Cancel appointment
  const cancelAppointment = useCallback(
    (appointmentId: string) => {
      dispatch(removeAppointment(appointmentId));
    },
    [dispatch]
  );

  // Computed values
  const upcomingAppointmentsCount = appointments.filter(
    (apt) => apt.status === 'scheduled'
  ).length;

  const overallProgress = therapyProgress
    ? Math.round(
        therapyProgress.goals.reduce((sum, goal) => sum + goal.progress, 0) /
          therapyProgress.goals.length
      )
    : 0;

  const hasUnreadNotifications = false; // This would come from a notifications slice

  return {
    // Data
    users,
    totalUsers,
    moodStats,
    appointments,
    therapyProgress,
    communityPosts,

    // Loading & Error states
    loading,
    error,

    // Refresh functions
    refreshUsers,
    refreshMoodStats,
    refreshAppointments,
    refreshTherapyProgress,
    refreshCommunityPosts,
    refreshAll,

    // Action functions
    clearError,
    updateGoal,
    likePost,
    createAppointment,
    cancelAppointment,

    // Computed values
    upcomingAppointmentsCount,
    overallProgress,
    hasUnreadNotifications,
  };
};

/**
 * Hook for mood tracking features
 */
export const useMoodTracking = () => {
  const dispatch = useAppDispatch();
  const { moodStats, loading } = useAppSelector((state) => state.dashboard);

  const refresh = useCallback(() => {
    dispatch(fetchMoodStats());
  }, [dispatch]);

  return {
    moodStats,
    loading,
    refresh,
  };
};

/**
 * Hook for appointments management
 */
export const useAppointments = () => {
  const dispatch = useAppDispatch();
  const { appointments, loading } = useAppSelector((state) => state.dashboard);

  const refresh = useCallback(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  const add = useCallback(
    (appointment: Appointment) => {
      dispatch(addAppointment(appointment));
    },
    [dispatch]
  );

  const cancel = useCallback(
    (id: string) => {
      dispatch(removeAppointment(id));
    },
    [dispatch]
  );

  const upcoming = appointments.filter((apt) => apt.status === 'scheduled');
  const completed = appointments.filter((apt) => apt.status === 'completed');

  return {
    appointments,
    upcoming,
    completed,
    loading,
    refresh,
    add,
    cancel,
  };
};

/**
 * Hook for therapy progress tracking
 */
export const useTherapyProgress = () => {
  const dispatch = useAppDispatch();
  const { therapyProgress, loading } = useAppSelector(
    (state) => state.dashboard
  );

  const refresh = useCallback(() => {
    dispatch(fetchTherapyProgress());
  }, [dispatch]);

  const updateGoal = useCallback(
    (goalId: string, progress: number) => {
      dispatch(updateGoalProgress({ goalId, progress }));
    },
    [dispatch]
  );

  const overallProgress = therapyProgress
    ? Math.round(
        therapyProgress.goals.reduce((sum, goal) => sum + goal.progress, 0) /
          therapyProgress.goals.length
      )
    : 0;

  return {
    therapyProgress,
    overallProgress,
    loading,
    refresh,
    updateGoal,
  };
};

export default useDashboard;