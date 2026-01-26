// src/redux/slices/auth.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthResponse, RegisterResponse, RegisterData, LoginData } from "../../pages/auth/auth.types";
import authService from "../../pages/auth/services/auth.service";

const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

interface ExtendedAuthState extends AuthState {
  resetUserId: string | null;
  otpVerified: boolean;
}

const initialState: ExtendedAuthState = {
  user: userFromStorage,
  loading: false,
  error: null,
  resetUserId: null,
  otpVerified: false,
};

// Async thunks
export const registerUser = createAsyncThunk<RegisterResponse, RegisterData>(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      // Backend does not return token on signup (requires manual login)
      // So we don't set localStorage or state.user here
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginData>(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const forgotPasswordUser = createAsyncThunk<{ message: string; id?: string }, { email: string }>(
  "auth/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(email);
      return { message: response.message, id: response.id };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to send reset email");
    }
  }
);

export const verifyOtpUser = createAsyncThunk<{ message: string }, { userId: string; otp: string }>(
  "auth/verifyOtp",
  async ({ userId, otp }, thunkAPI) => {
    try {
      const response = await authService.verifyOtp(userId, otp);
      return { message: response.message };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Invalid OTP");
    }
  }
);



export const resetPasswordUser = createAsyncThunk<{ message: string }, { userId: string; password: string; confirmPassword: string }>(
  "auth/resetPassword",
  async ({ userId, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await authService.resetPassword(userId, password, confirmPassword);
      return { message: response.message };
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Password reset failed");
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      state.user = null;
      state.error = null;
      state.loading = false;
      state.resetUserId = null;
      state.otpVerified = false;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      try {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } catch { }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateFollowing: (state, action: PayloadAction<string[]>) => {
      if (state.user) {
        state.user.following = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<RegisterResponse>) => {
        state.loading = false;
        // Registration successful, no user/token to set
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Forgot Password
      .addCase(forgotPasswordUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(forgotPasswordUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.id) {
          state.resetUserId = action.payload.id;
        }
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Verify OTP
      .addCase(verifyOtpUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyOtpUser.fulfilled, (state) => {
        state.loading = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Reset Password
      .addCase(resetPasswordUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resetPasswordUser.fulfilled, (state) => {
        state.loading = false;
        state.resetUserId = null;
        state.otpVerified = false;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { logout, clearError, setUser, updateFollowing } = authSlice.actions;

export default authSlice.reducer;
