import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";

const LoginPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
    <div className="w-full max-w-md">
      {/* Logo/Brand Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-gray-400">Sign in to continue to your account</p>
      </div>

      {/* Form Card */}
      <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-2xl">
        <LoginForm />
        
        {/* Links */}
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <Link 
              to="/forgetpass" 
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/50 text-gray-400">New here?</span>
            </div>
          </div>
          
          <div className="text-center">
            <Link 
              to="/register"
              className="inline-block w-full py-3 px-4 border-2 border-gray-700 hover:border-indigo-500 rounded-xl text-white font-medium transition-all duration-200 hover:bg-gray-800/50"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-gray-500 text-sm mt-8">
        Protected by reCAPTCHA and subject to the{" "}
        <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
      </p>
    </div>
  </div>
);

export default LoginPage;