import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm: React.FC = () => {
  const { resetPassword, loading, error, resetUserId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !resetUserId && !error) {
      // If no resetUserId (e.g. page refresh), redirect to start
      navigate("/forgetpass");
    }
  }, [resetUserId, loading, error, navigate]);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [passwordMatchError, setPasswordMatchError] = useState<string>("");

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("One special character");
    return errors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    setPasswordMatchError(""); // Clear match error when user types

    if (name === "password") {
      setValidationErrors(validatePassword(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMatchError("");

    if (passwords.password !== passwords.confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    }

    const errors = validatePassword(passwords.password);
    if (errors.length > 0) {
      return;
    }

    try {
      await resetPassword(passwords.password, passwords.confirmPassword);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      // Error handling is done by the useAuth hook
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-3">Password Reset Successfully!</h3>
        <p className="text-slate-600 mb-6">
          Your password has been updated. Redirecting to login...
        </p>
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter new password"
            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
            onChange={handleChange}
            value={passwords.password}
            required
            autoComplete="new-password"
            aria-describedby="password-description"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 rounded-lg transition-colors"
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {passwords.password && (
          <div className="mt-3">
            <div className="flex gap-1.5 mb-2">
              {[1, 2, 3, 4].map((level) => {
                const strength = validationErrors.length === 0 ? 4 :
                  validationErrors.length <= 1 ? 3 :
                    validationErrors.length <= 2 ? 2 : 1;
                return (
                  <div
                    key={level}
                    className={`h-2 flex-1 rounded-full transition-all ${level <= strength
                      ? strength === 4 ? "bg-green-500" : strength === 3 ? "bg-teal-500" : strength === 2 ? "bg-yellow-500" : "bg-red-500"
                      : "bg-slate-200"
                      }`}
                    aria-hidden="true"
                  />
                );
              })}
            </div>
            {validationErrors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs font-medium text-amber-800 mb-1">Still needed:</p>
                <ul className="text-xs text-amber-700 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <p id="password-description" className="sr-only">Enter a new password that meets all requirements</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Re-enter your new password"
            className={`w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 ${passwordMatchError || (passwords.confirmPassword && passwords.password !== passwords.confirmPassword)
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : passwords.confirmPassword && passwords.password === passwords.confirmPassword
                ? 'border-green-300'
                : 'border-slate-200'
              }`}
            onChange={handleChange}
            value={passwords.confirmPassword}
            required
            autoComplete="new-password"
            aria-describedby={passwordMatchError ? "confirm-error" : "confirm-description"}
            aria-invalid={!!passwordMatchError || (passwords.confirmPassword && passwords.password !== passwords.confirmPassword)}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 rounded-lg transition-colors"
          >
            {showConfirmPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {passwords.confirmPassword && passwords.password !== passwords.confirmPassword && (
          <p id="confirm-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Passwords do not match
          </p>
        )}
        {passwords.confirmPassword && passwords.password === passwords.confirmPassword && (
          <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Passwords match
          </p>
        )}
        {!passwords.confirmPassword && <p id="confirm-description" className="sr-only">Re-enter your new password to confirm</p>}
      </div>

      <button
        type="submit"
        disabled={loading || validationErrors.length > 0 || passwords.password !== passwords.confirmPassword || !passwords.password || !passwords.confirmPassword}
        className="w-full bg-gradient-to-r from-solidarity-blue to-teal-500 hover:from-blue-600 hover:to-teal-600 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
        aria-label={loading ? "Resetting password, please wait" : "Reset your password"}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resetting...
          </span>
        ) : (
          "Reset Password"
        )}
      </button>

      {error && (
        <div
          role="alert"
          aria-live="polite"
          className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-red-700 font-medium text-sm mb-1">Reset Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default ResetPasswordForm;