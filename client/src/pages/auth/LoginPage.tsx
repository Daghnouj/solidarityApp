import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";

const LoginPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 py-8 sm:py-12">
    {/* Decorative background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <div className="w-full max-w-md relative z-10">
      {/* Logo/Brand Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-solidarity-blue to-teal-500 rounded-3xl mb-6 shadow-lg shadow-blue-200/50">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-3">Welcome Back</h1>
        <p className="text-slate-600 text-lg">We're here to support you on your journey</p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
        <LoginForm />
        
        {/* Links */}
        <div className="mt-8 space-y-5">
          <div className="text-center">
            <Link 
              to="/forgetpass" 
              className="text-sm text-solidarity-blue hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 rounded-md px-2 py-1"
              aria-label="Reset your password"
            >
              Forgot your password?
            </Link>
          </div>
          
          <div className="relative" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-slate-500">New to Solidarity?</span>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              to="/register"
              className="inline-block w-full py-3.5 px-4 border-2 border-solidarity-blue hover:border-blue-600 rounded-xl text-solidarity-blue hover:text-blue-600 font-semibold transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2"
              aria-label="Create a new account"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-6 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-solidarity-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Encrypted</span>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Your privacy is our priority. All data is encrypted and protected.
        </p>
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