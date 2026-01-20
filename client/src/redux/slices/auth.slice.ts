// src/redux/slices/auth.slice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthResponse, User } from "../../pages/auth/auth.types";


const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")!)
  : null;

const initialState: AuthState = {
  user: userFromStorage,
  loading: false,
  error: null,
};

// Async thunks
export const registerUser = createAsyncThunk<AuthResponse, User>(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      const response = await authService.register(user);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("token", response.token);
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string }>(
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

export const forgotPasswordUser = createAsyncThunk<{ message: string }, { email: string }>(
  "auth/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      return await authService.forgotPassword(email);
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to send reset email");
    }
  }
);

export const resetPasswordUser = createAsyncThunk<{ message: string }, { token: string; password: string }>(
  "auth/resetPassword",
  async ({ token, password }, thunkAPI) => {
    try {
      return await authService.resetPassword(token, password);
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
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => { state.loading = false; state.user = action.payload.user; })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => { state.loading = false; state.user = action.payload.user; })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(forgotPasswordUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(forgotPasswordUser.fulfilled, (state) => { state.loading = false; })
      .addCase(forgotPasswordUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      .addCase(resetPasswordUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resetPasswordUser.fulfilled, (state) => { state.loading = false; })
      .addCase(resetPasswordUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
