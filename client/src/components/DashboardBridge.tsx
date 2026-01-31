import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../pages/auth/hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

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
    <LoadingSpinner message="Redirecting to your dashboard..." />
  );
};

export default DashboardBridge;
