import React, { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

import type { RegisterData, ProfessionalInfo } from "../auth.types";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "your-recaptcha-site-key";

const RegisterForm: React.FC = () => {
  const { register, loading, error } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    birthday: "",
    address: "",
    phoneNumber: "",
    isProfessional: false,
  });

  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo>({
    specialty: "",
    professionalSituation: "",
    diplomaTitle: "",
    institutionName: "",
    graduationDate: "",
    biography: "",
  });

  const [document, setDocument] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfessionalInfo({ ...professionalInfo, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    
  

    const registerData: RegisterData = {
      ...form,
      professionalInfo: form.isProfessional ? professionalInfo : undefined,
      document: document || undefined,
    };

    register(registerData);
  };

  

  

  const nextStep = () => {
    if (currentStep === 1) {
      if (!form.name || !form.email || !form.password) {
        alert("Please fill in all required fields");
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div>
      {/* Social Signup Buttons - Always visible */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-white hover:bg-gray-100 rounded-xl font-medium text-gray-900 transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            disabled={loading}
            className="flex items-center justify-center px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl font-medium text-white transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-900/50 text-gray-400">Or register with email</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                currentStep >= step 
                  ? "border-green-500 bg-green-500 text-white" 
                  : "border-gray-700 text-gray-500"
              }`}>
                {currentStep > step ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                  currentStep > step ? "bg-green-500" : "bg-gray-700"
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>Basic Info</span>
          <span>Personal Details</span>
          <span>Professional</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                onChange={handleChange}
                value={form.name}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                onChange={handleChange}
                value={form.email}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={form.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Birthday *</label>
                <input
                  type="date"
                  name="birthday"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={form.birthday}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={handleChange}
                  value={form.phoneNumber}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St, City, Country"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                onChange={handleChange}
                value={form.address}
                required
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
              <input
                type="checkbox"
                id="isProfessional"
                name="isProfessional"
                checked={form.isProfessional}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-600 text-green-600 focus:ring-green-500 focus:ring-offset-gray-900"
              />
              <label htmlFor="isProfessional" className="text-sm font-medium text-gray-300">
                I am a professional (Doctor, Therapist, etc.)
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-white font-semibold transition-all duration-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg"
              >
                {form.isProfessional ? "Continue" : "Skip & Finish"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Professional Information */}
        {currentStep === 3 && form.isProfessional && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Specialty *</label>
                <select
                  name="specialty"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={handleProfessionalChange}
                  value={professionalInfo.specialty}
                  required
                >
                  <option value="">Select specialty</option>
                  <option value="psychology">Psychology</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="counseling">Counseling</option>
                  <option value="therapy">Therapy</option>
                  <option value="social-work">Social Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Professional Situation *</label>
                <select
                  name="professionalSituation"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={handleProfessionalChange}
                  value={professionalInfo.professionalSituation}
                  required
                >
                  <option value="">Select situation</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="freelance">Freelance</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Diploma Title *</label>
              <input
                type="text"
                name="diplomaTitle"
                placeholder="Ph.D. in Clinical Psychology"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                onChange={handleProfessionalChange}
                value={professionalInfo.diplomaTitle}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Institution Name *</label>
                <input
                  type="text"
                  name="institutionName"
                  placeholder="Harvard University"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={handleProfessionalChange}
                  value={professionalInfo.institutionName}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Graduation Date *</label>
                <input
                  type="date"
                  name="graduationDate"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  onChange={handleProfessionalChange}
                  value={professionalInfo.graduationDate}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Biography *</label>
              <textarea
                name="biography"
                placeholder="Tell us about your professional experience and expertise..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                onChange={handleProfessionalChange}
                value={professionalInfo.biography}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Professional Document * (License, Certificate, etc.)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="document"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label
                  htmlFor="document"
                  className="flex items-center justify-center w-full px-4 py-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-green-500 transition-all"
                >
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-400">
                      {document ? document.name : "Click to upload document"}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                  </div>
                </label>
              </div>
            </div>

            

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-800 hover:bg-gray-700 py-3 rounded-xl text-white font-semibold transition-all duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-start">
            <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;