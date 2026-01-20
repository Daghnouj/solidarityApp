import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

const RegisterPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4 py-12">
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Create Your Account</h1>
        <p className="text-gray-400">Join us today and get started</p>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <RegisterForm />
        
        {/* Links */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/50 text-gray-400">Already have an account?</span>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <Link 
              to="/login"
              className="inline-block w-full py-3 px-4 border-2 border-gray-700 hover:border-green-500 rounded-xl text-white font-medium transition-all duration-200 hover:bg-gray-800/50"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm mt-8">
        By signing up, you agree to our{" "}
        <a href="#" className="text-green-400 hover:text-green-300">Terms of Service</a>
        {" "}and{" "}
        <a href="#" className="text-green-400 hover:text-green-300">Privacy Policy</a>
      </p>
    </div>
  </div>
);

export default RegisterPage;