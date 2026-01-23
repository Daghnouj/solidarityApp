import React from "react";
import { Link } from "react-router-dom";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="h-screen w-full flex bg-white">
      {/* Left Panel - Visuals & Branding (50%) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 items-center justify-center p-12 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-solidarity-blue to-teal-500 rounded-3xl mb-8 shadow-xl shadow-blue-200/50">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-6 leading-tight">Recover Your Account</h1>
          <p className="text-slate-600 text-xl leading-relaxed">
            Don't worry, we'll help you get back access to your account in no time.
          </p>
        </div>
      </div>

      {/* Right Panel - Form (50%) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white overflow-y-auto">
        <div className="w-full max-w-xl space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-solidarity-blue to-teal-500 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">Forgot Password</h2>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold text-slate-900 hidden lg:block">Forgot Password?</h2>
            <p className="mt-2 text-slate-600">Enter your email and we’ll send you a one-time password (OTP).</p>
          </div>

          <ForgotPasswordForm />

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-700 font-medium mb-1">
              How it works
            </p>
            <p className="text-sm text-blue-600">
              The OTP expires in 10 minutes for security. Check your spam folder if you don't receive it.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/login"
              className="inline-flex items-center text-solidarity-blue font-semibold hover:text-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to login
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
};

export default ForgotPasswordPage;
