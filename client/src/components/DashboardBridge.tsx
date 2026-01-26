import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/auth/hooks/useAuth";

const DashboardBridge: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "professional" || user.isProfessional) {
      navigate("/dashboard/professional");
    } else {
      navigate("/dashboard/user");
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solidarity-blue mx-auto mb-4"></div>
        <p className="text-slate-600 font-medium">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardBridge;
