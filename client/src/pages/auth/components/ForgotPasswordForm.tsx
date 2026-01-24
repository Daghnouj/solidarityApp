import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, verifyOtp, loading, error } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email); // send OTP
      setStep("otp");
    } catch { }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(otp); // backend verification
      // Redirect to reset password page using navigate to preserve REDUX state
      navigate("/resetpass");
    } catch { }
  };

  /* ================= EMAIL STEP ================= */
  if (step === "email") {
    return (
      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-solidarity-blue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-solidarity-blue to-teal-500 py-4 rounded-xl text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            {error}
          </div>
        )}
      </form>
    );
  }

  /* ================= OTP STEP ================= */
  return (
    <form onSubmit={handleOtpSubmit} className="space-y-6 text-center">
      <h3 className="text-2xl font-bold text-slate-800">
        Enter OTP
      </h3>

      <p className="text-slate-600 text-sm">
        We sent a 6-digit code to <br />
        <span className="font-semibold text-slate-800">{email}</span>
      </p>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="••••••"
        className="w-full text-center tracking-widest text-2xl px-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-solidarity-blue"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full bg-gradient-to-r from-solidarity-blue to-teal-500 py-4 rounded-xl text-white font-semibold disabled:opacity-50"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        type="button"
        onClick={() => setStep("email")}
        className="text-sm text-solidarity-blue hover:underline"
      >
        Resend OTP
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
        </div>
      )}
    </form>
  );
};

export default ForgotPasswordForm;
