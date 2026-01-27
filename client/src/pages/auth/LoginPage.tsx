import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage: React.FC = () => (
  <div className="h-screen w-full flex bg-white">
    {/* Left Panel - Visuals & Branding (50%) */}
    <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 items-center justify-center p-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Brand Content */}
      <div className="relative z-10 text-center max-w-lg">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-solidarity-blue to-teal-500 rounded-3xl mb-8 shadow-xl shadow-blue-200/50">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">Welcome Back to Solidarity</h1>
        <p className="text-slate-600 text-xl leading-relaxed">
          We're here to support you on your journey. secure, private, and always here for you.
        </p>

        {/* Trust Indicators (Moved relative to left panel) */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-solidarity-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>

    {/* Right Panel - Login Form (50%) */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white overflow-y-auto">
      <div className="w-full max-w-xl space-y-8">
        {/* Mobile Logo (Visible only on small screens) */}
        <div className="lg:hidden text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-solidarity-blue to-teal-500 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
        </div>

        <div className="text-center lg:text-left mb-8">
          <h2 className="text-3xl font-bold text-slate-900 hidden lg:block">Sign In</h2>
          <p className="mt-2 text-slate-600">Please enter your details to access your account.</p>
        </div>

        <LoginForm />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => window.location.href = `${API_URL}/auth/google`}
            className="flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5 mr-2" alt="Google" />
            <span className="text-sm font-medium text-slate-700">Google</span>
          </button>
          <button
            onClick={() => window.location.href = `${API_URL}/auth/facebook`}
            className="flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="h-5 w-5 mr-2" alt="Facebook" />
            <span className="text-sm font-medium text-slate-700">Facebook</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/forgetpass"
                className="font-medium text-solidarity-blue hover:text-blue-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">New to Solidarity?</span>
            </div>
          </div>

          <Link
            to="/register"
            className="flex w-full justify-center items-center px-4 py-3 border-2 border-slate-200 hover:border-solidarity-blue rounded-xl text-slate-600 hover:text-solidarity-blue font-semibold transition-all duration-200 hover:bg-blue-50"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>

    <style>{`
      @keyframes blob {
        0%, 100% { transform: translate(0, 0) scale(1); }
        33% { transform: translate(30px, -50px) scale(1.1); }
        66% { transform: translate(-20px, 20px) scale(0.9); }
      }
      .animate-blob {
        animation: blob 7s infinite;
      }
      .animation-delay-2000 {
        animation-delay: 2s;
      }
      .animation-delay-4000 {
        animation-delay: 4s;
      }
    `}</style>
  </div>
);

export default LoginPage;