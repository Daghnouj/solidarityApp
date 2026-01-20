import React from "react";
import ResetPasswordForm from "./components/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-gray-400">Create a new strong password for your account</p>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <ResetPasswordForm />
      </div>

      {/* Password Requirements */}
      <div className="mt-8 p-4 bg-gray-900/30 rounded-2xl border border-gray-800">
        <h3 className="text-sm font-semibold text-white mb-3">Password requirements:</h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            At least 8 characters long
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Contains uppercase and lowercase letters
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Contains at least one number
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Contains at least one special character
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default ResetPasswordPage;