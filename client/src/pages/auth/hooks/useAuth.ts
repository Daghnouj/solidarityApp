// src/pages/auth/hooks/useAuth.ts
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../redux/store";
import {
  loginUser,
  registerUser,
  forgotPasswordUser,
  verifyOtpUser,
  resetPasswordUser,
  logout,
  // @ts-ignore
  setUser
} from "../../../redux/slices/auth.slice";
import type { RegisterData, LoginData } from "../auth.types";
import AuthService from "../services/auth.service";

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

    refreshCurrentUser: async () => {
      try {
        const me = await AuthService.getCurrentUser();
        // Ensure we keep any existing fields mapping
        // Backend may return 'nom'; map to 'name' for consistency
        // The service already maps, but keep as safe-guard
        // @ts-ignore
        if ((me as any).nom && !(me as any).name) {
          // @ts-ignore
          (me as any).name = (me as any).nom;
        }
        dispatch(setUser(me) as any);
        return me;
      } catch (e) {
        // Silently ignore for UI convenience
        return null;
      }
    }
  };
};