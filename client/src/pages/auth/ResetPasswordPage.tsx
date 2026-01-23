import React from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 py-8 sm:py-12">
    {/* Decorative background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <div className="w-full max-w-md relative z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-solidarity-blue to-teal-500 rounded-3xl mb-6 shadow-lg shadow-blue-200/50">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-3">Reset Password</h1>
        <p className="text-slate-600 text-lg">Create a new secure password for your account</p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
        <ResetPasswordForm />
      </div>

      {/* Password Requirements */}
      <div className="mt-8 p-5 bg-teal-50 border-l-4 border-teal-500 rounded-r-lg">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Password requirements:
        </h3>
        <ul className="space-y-2.5 text-sm text-slate-600">
          <li className="flex items-center">
            <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            At least 8 characters long
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Contains uppercase and lowercase letters
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Contains at least one number
          </li>
          <li className="flex items-center">
            <svg className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Contains at least one special character
          </li>
        </ul>
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

export default ResetPasswordPage;