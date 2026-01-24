// src/pages/auth/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  loginUser,
  registerUser,
  forgotPasswordUser,
  verifyOtpUser,
  resetPasswordUser,
  logout
} from "../../../redux/slices/auth.slice";
import type { RegisterData, LoginData } from "../auth.types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  // @ts-ignore - auth slice extended with resetUserId
  const resetUserId = (auth as any).resetUserId;

  return {
    user: auth?.user ?? null,
    loading: auth?.loading ?? false,
    error: auth?.error ?? null,
    resetUserId,

    login: (data: LoginData) => dispatch(loginUser(data)),

    register: (data: RegisterData) => dispatch(registerUser(data)),

    forgotPassword: (email: string) => dispatch(forgotPasswordUser({ email })),

    verifyOtp: (otp: string) => {
      if (!resetUserId) throw new Error("No user ID found for verification");
      return dispatch(verifyOtpUser({ userId: resetUserId, otp }));
    },

    resetPassword: (password: string, confirmPassword: string) => {
      if (!resetUserId) throw new Error("No user ID found for reset");
      return dispatch(resetPasswordUser({ userId: resetUserId, password, confirmPassword }));
    },

    logout: () => {
      localStorage.removeItem('token');
      dispatch(logout());
    },
  };
};