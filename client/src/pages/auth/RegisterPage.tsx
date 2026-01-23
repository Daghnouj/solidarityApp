import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";

const RegisterPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 py-8 sm:py-12">
    {/* Decorative background elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
    </div>

    <div className="w-full max-w-4xl relative z-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-solidarity-blue to-teal-500 rounded-3xl mb-6 shadow-lg shadow-blue-200/50">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-800 mb-3">Join Solidarity</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Take the first step towards better mental health. We're here to support you every step of the way.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/50">
        <RegisterForm />
        
        {/* Links */}
        <div className="mt-8">
          <div className="relative" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-slate-500">Already have an account?</span>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <Link 
              to="/login"
              className="inline-block w-full py-3.5 px-4 border-2 border-solidarity-blue hover:border-blue-600 rounded-xl text-solidarity-blue hover:text-blue-600 font-semibold transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2"
              aria-label="Sign in to your existing account"
            >
              Sign in instead
            </Link>
          </div>
        </div>
      </div>

      {/* Trust & Privacy Section */}
      <div className="mt-8 text-center">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-solidarity-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>End-to-End Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-solidarity-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Licensed Professionals</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          By signing up, you agree to our{" "}
          <a href="#" className="text-solidarity-blue hover:text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-solidarity-blue rounded">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-solidarity-blue hover:text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-solidarity-blue rounded">Privacy Policy</a>
        </p>
        <p className="text-xs text-slate-400">
          Your information is safe with us. We never share your data with third parties.
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

export default RegisterPage;