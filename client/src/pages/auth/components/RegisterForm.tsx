import React, { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";

import type { RegisterData, ProfessionalInfo } from "../auth.types";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "your-recaptcha-site-key";

const RegisterForm: React.FC = () => {
  const { register, loading, error } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
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

  

  

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) {
      errors.name = "Please enter your full name";
    }
    if (!form.email.trim()) {
      errors.email = "Please enter your email address";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      errors.password = "Please create a password";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
    }
    setValidationErrors({});
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <div>
      {/* Social Signup Buttons - Always visible */}
      <div className="mb-8">
        <p className="text-sm text-slate-600 mb-4 text-center">Quick sign up with:</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading}
            aria-label="Sign up with Google"
            className="flex items-center justify-center px-4 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-xl font-medium text-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" aria-hidden="true">
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
            aria-label="Sign up with Facebook"
            className="flex items-center justify-center px-4 py-3 bg-[#1877F2] hover:bg-[#166FE5] rounded-xl font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 shadow-sm hover:shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="relative my-6" aria-hidden="true">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/80 text-slate-500">Or continue with email</span>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3} aria-label={`Registration step ${currentStep} of 3`}>
        <div className="flex items-center justify-between mb-3">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                currentStep >= step 
                  ? "border-solidarity-blue bg-solidarity-blue text-white shadow-lg shadow-blue-200/50" 
                  : "border-slate-300 text-slate-400 bg-white"
              }`}>
                {currentStep > step ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all ${
                  currentStep > step ? "bg-solidarity-blue" : "bg-slate-200"
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-600 font-medium">
          <span className={currentStep === 1 ? "text-solidarity-blue" : ""}>Basic Info</span>
          <span className={currentStep === 2 ? "text-solidarity-blue" : ""}>Personal Details</span>
          <span className={currentStep === 3 ? "text-solidarity-blue" : ""}>Professional</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-solidarity-blue p-4 rounded-r-lg mb-6">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700">
                  <strong>Your privacy matters.</strong> All information is encrypted and kept confidential.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                className={`w-full px-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:border-solidarity-blue transition-all duration-200 hover:border-slate-300 ${
                  validationErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'
                }`}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                value={form.name}
                required
                autoComplete="name"
                aria-describedby={validationErrors.name ? "name-error" : "name-description"}
                aria-invalid={!!validationErrors.name}
              />
              {validationErrors.name ? (
                <p id="name-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationErrors.name}
                </p>
              ) : (
                <p id="name-description" className="sr-only">Enter your full legal name</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:border-solidarity-blue transition-all duration-200 hover:border-slate-300 ${
                  validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'
                }`}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                value={form.email}
                required
                autoComplete="email"
                aria-describedby={validationErrors.email ? "email-error" : "email-description"}
                aria-invalid={!!validationErrors.email}
              />
              {validationErrors.email ? (
                <p id="email-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationErrors.email}
                </p>
              ) : (
                <p id="email-description" className="sr-only">Enter a valid email address for your account</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  className={`w-full px-4 py-3.5 pr-12 bg-slate-50 border-2 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 ${
                    validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200'
                  }`}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  value={form.password}
                  required
                  autoComplete="new-password"
                  aria-describedby={validationErrors.password ? "password-error" : "password-description"}
                  aria-invalid={!!validationErrors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  onFocus={() => setFocusedField('password-toggle')}
                  onBlur={() => setFocusedField(null)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 rounded-lg transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password ? (
                <p id="password-error" className="text-red-600 text-sm mt-1 flex items-center gap-1" role="alert">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationErrors.password}
                </p>
              ) : (
                <p id="password-description" className="text-xs text-slate-500 mt-1">
                  Must be at least 8 characters. Use a mix of letters, numbers, and symbols for better security.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full bg-gradient-to-r from-solidarity-blue to-teal-500 hover:from-blue-600 hover:to-teal-600 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="Continue to next step"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg mb-2">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-teal-700">
                  This information helps us provide you with personalized support and connect you with the right resources.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="birthday" className="block text-sm font-semibold text-slate-700 mb-2">
                  Date of Birth <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  id="birthday"
                  type="date"
                  name="birthday"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                  onChange={handleChange}
                  onFocus={() => setFocusedField('birthday')}
                  onBlur={() => setFocusedField(null)}
                  value={form.birthday}
                  required
                  autoComplete="bday"
                  aria-describedby="birthday-description"
                />
                <p id="birthday-description" className="sr-only">Enter your date of birth</p>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone Number <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phoneNumber')}
                  onBlur={() => setFocusedField(null)}
                  value={form.phoneNumber}
                  required
                  autoComplete="tel"
                  aria-describedby="phone-description"
                />
                <p id="phone-description" className="sr-only">Enter your phone number with country code</p>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-2">
                Address <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="address"
                type="text"
                name="address"
                placeholder="Street address, City, Country"
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                onChange={handleChange}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
                value={form.address}
                required
                autoComplete="street-address"
                aria-describedby="address-description"
              />
              <p id="address-description" className="text-xs text-slate-500 mt-1">
                Used for connecting you with local resources and professionals in your area
              </p>
            </div>

            <div className="flex items-start space-x-3 p-5 bg-blue-50 rounded-xl border-2 border-blue-100">
              <input
                type="checkbox"
                id="isProfessional"
                name="isProfessional"
                checked={form.isProfessional}
                onChange={handleChange}
                onFocus={() => setFocusedField('isProfessional')}
                onBlur={() => setFocusedField(null)}
                className="mt-1 w-5 h-5 rounded border-slate-300 text-solidarity-blue focus:ring-solidarity-blue focus:ring-offset-2"
                aria-describedby="professional-description"
              />
              <label htmlFor="isProfessional" className="text-sm font-medium text-slate-700 cursor-pointer">
                I am a licensed mental health professional
                <p id="professional-description" className="text-xs text-slate-500 mt-1 font-normal">
                  (Doctor, Therapist, Counselor, Social Worker, etc.)
                </p>
              </label>
            </div>

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3.5 rounded-xl text-slate-700 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                aria-label="Go back to previous step"
              >
                Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-solidarity-blue to-teal-500 hover:from-blue-600 hover:to-teal-600 py-3.5 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
                aria-label={form.isProfessional ? "Continue to professional information" : "Complete registration"}
              >
                {form.isProfessional ? "Continue" : "Complete Registration"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Professional Information */}
        {currentStep === 3 && form.isProfessional && (
          <div className="space-y-6">
            <div className="bg-orange-50 border-l-4 border-solidarity-orange p-4 rounded-r-lg mb-2">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-solidarity-orange mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="text-sm text-orange-700">
                  <strong>Verification required.</strong> Your credentials will be reviewed to ensure the safety and quality of our platform. This typically takes 1-2 business days.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="specialty" className="block text-sm font-semibold text-slate-700 mb-2">
                  Specialty <span className="text-red-500" aria-label="required">*</span>
                </label>
                <select
                  id="specialty"
                  name="specialty"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                  onChange={handleProfessionalChange}
                  onFocus={() => setFocusedField('specialty')}
                  onBlur={() => setFocusedField(null)}
                  value={professionalInfo.specialty}
                  required
                  aria-describedby="specialty-description"
                >
                  <option value="">Select your specialty</option>
                  <option value="psychology">Psychology</option>
                  <option value="psychiatry">Psychiatry</option>
                  <option value="counseling">Counseling</option>
                  <option value="therapy">Therapy</option>
                  <option value="social-work">Social Work</option>
                  <option value="other">Other</option>
                </select>
                <p id="specialty-description" className="sr-only">Select your professional specialty</p>
              </div>

              <div>
                <label htmlFor="professionalSituation" className="block text-sm font-semibold text-slate-700 mb-2">
                  Professional Situation <span className="text-red-500" aria-label="required">*</span>
                </label>
                <select
                  id="professionalSituation"
                  name="professionalSituation"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                  onChange={handleProfessionalChange}
                  onFocus={() => setFocusedField('professionalSituation')}
                  onBlur={() => setFocusedField(null)}
                  value={professionalInfo.professionalSituation}
                  required
                  aria-describedby="situation-description"
                >
                  <option value="">Select your situation</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="freelance">Freelance</option>
                  <option value="student">Student</option>
                  <option value="retired">Retired</option>
                </select>
                <p id="situation-description" className="sr-only">Select your current professional situation</p>
              </div>
            </div>

            <div>
              <label htmlFor="diplomaTitle" className="block text-sm font-semibold text-slate-700 mb-2">
                Diploma/Degree Title <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="diplomaTitle"
                type="text"
                name="diplomaTitle"
                placeholder="e.g., Ph.D. in Clinical Psychology, M.D. in Psychiatry"
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                onChange={handleProfessionalChange}
                onFocus={() => setFocusedField('diplomaTitle')}
                onBlur={() => setFocusedField(null)}
                value={professionalInfo.diplomaTitle}
                required
                aria-describedby="diploma-description"
              />
              <p id="diploma-description" className="text-xs text-slate-500 mt-1">
                Enter your highest relevant degree or certification
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="institutionName" className="block text-sm font-semibold text-slate-700 mb-2">
                  Institution Name <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  id="institutionName"
                  type="text"
                  name="institutionName"
                  placeholder="University or Institution name"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                  onChange={handleProfessionalChange}
                  onFocus={() => setFocusedField('institutionName')}
                  onBlur={() => setFocusedField(null)}
                  value={professionalInfo.institutionName}
                  required
                  aria-describedby="institution-description"
                />
                <p id="institution-description" className="sr-only">Enter the name of the institution where you received your degree</p>
              </div>

              <div>
                <label htmlFor="graduationDate" className="block text-sm font-semibold text-slate-700 mb-2">
                  Graduation Date <span className="text-red-500" aria-label="required">*</span>
                </label>
                <input
                  id="graduationDate"
                  type="date"
                  name="graduationDate"
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300"
                  onChange={handleProfessionalChange}
                  onFocus={() => setFocusedField('graduationDate')}
                  onBlur={() => setFocusedField(null)}
                  value={professionalInfo.graduationDate}
                  required
                  aria-describedby="graduation-description"
                />
                <p id="graduation-description" className="sr-only">Enter the date you graduated or received your certification</p>
              </div>
            </div>

            <div>
              <label htmlFor="biography" className="block text-sm font-semibold text-slate-700 mb-2">
                Professional Biography <span className="text-red-500" aria-label="required">*</span>
              </label>
              <textarea
                id="biography"
                name="biography"
                placeholder="Tell us about your professional experience, areas of expertise, and approach to mental health care..."
                rows={5}
                className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-slate-300 resize-none"
                onChange={handleProfessionalChange}
                onFocus={() => setFocusedField('biography')}
                onBlur={() => setFocusedField(null)}
                value={professionalInfo.biography}
                required
                aria-describedby="biography-description"
              />
              <p id="biography-description" className="text-xs text-slate-500 mt-1">
                This will be visible to potential clients. Share your experience and what makes your approach unique.
              </p>
            </div>

            <div>
              <label htmlFor="document" className="block text-sm font-semibold text-slate-700 mb-2">
                Professional License/Certificate <span className="text-red-500" aria-label="required">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="document"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                  aria-describedby="document-description"
                />
                <label
                  htmlFor="document"
                  className={`flex items-center justify-center w-full px-4 py-10 bg-slate-50 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    document 
                      ? 'border-solidarity-blue bg-blue-50' 
                      : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50'
                  } focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
                >
                  <div className="text-center">
                    {document ? (
                      <>
                        <svg className="mx-auto h-12 w-12 text-green-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-slate-700 mb-1">
                          {document.name}
                        </p>
                        <p className="text-xs text-slate-500">Click to change file</p>
                      </>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          Click to upload your license or certificate
                        </p>
                        <p className="text-xs text-slate-500">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
              <p id="document-description" className="text-xs text-slate-500 mt-2">
                Upload a clear copy of your professional license, certification, or diploma. This will be kept confidential and used only for verification purposes.
              </p>
            </div>

            

            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-slate-100 hover:bg-slate-200 py-3.5 rounded-xl text-slate-700 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                aria-label="Go back to previous step"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-solidarity-blue to-teal-500 hover:from-blue-600 hover:to-teal-600 py-3.5 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 focus:outline-none focus:ring-2 focus:ring-solidarity-blue focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
                aria-label={loading ? "Creating your account, please wait" : "Complete registration and create account"}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
          <div 
            role="alert" 
            aria-live="polite"
            className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 mt-6"
          >
            <svg className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-red-700 font-medium text-sm mb-1">Registration Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;