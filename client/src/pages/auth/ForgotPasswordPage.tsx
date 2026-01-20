import React from "react";
import { Link } from "react-router-dom";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPasswordPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
        <p className="text-gray-400">No worries, we'll send you reset instructions</p>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <ForgotPasswordForm />
        
        {/* Back to Login Link */}
        <div className="mt-6">
          <Link 
            to="/auth/login"
            className="flex items-center justify-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to login
          </Link>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 p-4 bg-gray-900/30 rounded-2xl border border-gray-800">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-400">
              Enter your email address and we'll send you a link to reset your password. 
              The link will expire in 1 hour for security reasons.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ForgotPasswordPage;