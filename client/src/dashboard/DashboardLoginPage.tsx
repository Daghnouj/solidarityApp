// DashboardLoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}


const DashboardLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Use VITE_API_URL from environment variable
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          mdp: formData.password
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminData", JSON.stringify(data.admin));
      }

      // Redirect to admin dashboard
      navigate("/admin", { 
        state: { 
          message: "Login successful!",
          admin: data.admin 
        } 
      });

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("Please enter your email to reset password");
      return;
    }

    try {
      // Implement password reset for admins if your API supports it
      console.log("Forgot password for:", formData.email);
    } catch (err) {
      console.error("Forgot password error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">
            Restricted access for administrators only
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-800/50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-300">{error}</div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      validationErrors.email 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-slate-700 focus:ring-indigo-500 hover:border-slate-600"
                    }`}
                    placeholder="admin@example.com"
                    disabled={loading}
                    autoComplete="email"
                  />
                  {validationErrors.email && (
                    <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-slate-800/50 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-12 ${
                      validationErrors.password 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-slate-700 focus:ring-indigo-500 hover:border-slate-600"
                    }`}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {validationErrors.password && (
                    <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      {validationErrors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-3 bg-slate-900 text-slate-500 font-medium">
                  Other Access
                </span>
              </div>
            </div>

            {/* User Login Link */}
            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3 px-4 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800/30 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-all duration-300 group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Standard User Access
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800/50">
            <p className="text-xs text-center text-slate-500">
              © {new Date().getFullYear()} Admin Dashboard • Secure Access
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-900/30 px-3 py-1.5 rounded-full border border-slate-800/50">
            <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>HTTPS Encrypted Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLoginPage;