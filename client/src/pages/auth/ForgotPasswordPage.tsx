import React from "react";
import { Link } from "react-router-dom";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-solidarity-blue to-teal-500 rounded-3xl mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Forgot Password?
          </h1>
          <p className="text-slate-600 text-lg">
            We'll send you an OTP to reset your password
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl">
          <ForgotPasswordForm />

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-solidarity-blue font-medium hover:underline"
            >
              ← Back to login
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-700 font-medium mb-1">
            How it works
          </p>
          <p className="text-sm text-blue-600">
            Enter your email and we’ll send you a one-time password (OTP).
            The OTP expires in 10 minutes for security.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
