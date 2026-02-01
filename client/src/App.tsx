// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import Layout from "./components/Layout";
import AdminLayout from "./dashboard/AdminLayout";

// Pages - Public
import Home from "./pages/Home/Home";
import Professionals from "./pages/Professionals/Professionals";
import ProfessionalProfile from "./pages/ProfessionalProfile/ProfessionalsProfile";
import BookingPage from "./pages/Booking/BookingPage";
import ActivitiesCenters from "./pages/ActivitiesCenters/ActivitiesCenters";
import Community from "./pages/community/community";
import Galerie from "./pages/galerie/Galerie";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import MessagesPage from "./pages/Messages/MessagesPage";

// Pages - Auth
import LoginForm from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import OAuthCallbackPage from "./pages/auth/OAuthCallbackPage";


// Pages - Admin Dashboard
import OverviewPage from "./dashboard/OverviewPage";
import UsersPage from "./dashboard/UsersPage";
import RequestsPage from "./dashboard/RequestsPage";
import ActivitiesCentersPage from "./dashboard/ActivitiesCentersPage";
import GalleryPage from "./dashboard/GalleryPage";
import AdminProfilePage from "./dashboard/AdminProfilePage";
import DashboardLoginPage from "./dashboard/DashboardLoginPage";

// Pages - User Dashboard
import UserLayout from "./dashboarduser/UserLayout";
import UserOverview from "./dashboarduser/pages/UserOverview";
import UserAppointments from "./dashboarduser/pages/UserAppointments";
import UserSavedSpecialists from "./dashboarduser/pages/UserSavedSpecialists";
import UserCommunity from "./dashboarduser/pages/UserCommunity";
import UserSavedPosts from "./dashboarduser/pages/UserSavedPosts";
import UserProfile from "./dashboarduser/pages/UserProfile";

// Pages - Professional Dashboard
import ProfessionalLayout from "./dashboardprofessional/ProfessionalLayout";
import ProfessionalOverview from "./dashboardprofessional/pages/ProfessionalOverview";
import ProfessionalSchedule from "./dashboardprofessional/pages/ProfessionalSchedule";
import ProfessionalAppointments from "./dashboardprofessional/pages/ProfessionalAppointments";
import ProfessionalCommunity from "./dashboardprofessional/pages/ProfessionalCommunity";
import ProfessionalSavedPosts from "./dashboardprofessional/pages/ProfessionalSavedPosts";
import ProfessionalProfileDashboard from "./dashboardprofessional/pages/ProfessionalProfile";

// Components
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./pages/ProfessionalProfile/components/ErrorBoundary";
import { SocketProvider } from "./context/SocketContext";
import DashboardBridge from "./components/DashboardBridge";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <SocketProvider>
        <Toaster position="top-right" />
        <Router>
          <ScrollToTop />
          <Routes>

            {/* ================= Public Layout ================= */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/professionals" element={<Professionals />} />
              <Route path="/professionals/:id" element={<ProtectedRoute><ProfessionalProfile /></ProtectedRoute>} />
              <Route path="/book/:therapistId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
              <Route path="/activities-centers" element={<ProtectedRoute><ActivitiesCenters /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
              <Route path="/galerie" element={<ProtectedRoute><Galerie /></ProtectedRoute>} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* ================= Messages (Isolated Layout to hide Footer) ================= */}
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />

            {/* ================= Admin Dashboard ================= */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<OverviewPage />} />       {/* /admin */}
              <Route path="users" element={<UsersPage />} />   {/* /admin/users */}
              <Route path="requests" element={<RequestsPage />} />
              <Route path="activities-centers" element={<ActivitiesCentersPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route path="profile" element={<AdminProfilePage />} />
              {/* Add more admin routes here later */}
            </Route>

            {/* ================= User Dashboard ================= */}
            <Route path="/dashboard" element={<DashboardBridge />} />
            <Route path="/dashboard/user" element={<UserLayout />}>
              <Route index element={<UserOverview />} />
              <Route path="appointments" element={<UserAppointments />} />
              <Route path="favorites" element={<UserSavedSpecialists />} />
              <Route path="community" element={<UserCommunity />} />
              <Route path="saved" element={<UserSavedPosts />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>

            {/* ================= Professional Dashboard ================= */}
            <Route path="/dashboard/professional" element={<ProfessionalLayout />}>
              <Route index element={<ProfessionalOverview />} />
              <Route path="requests" element={<ProfessionalAppointments />} />
              <Route path="calendar" element={<ProfessionalSchedule />} />
              <Route path="community" element={<ProfessionalCommunity />} />
              <Route path="saved" element={<ProfessionalSavedPosts />} />
              <Route path="profile" element={<ProfessionalProfileDashboard />} />
            </Route>

            {/* ================= Admin Login (no dashboard layout) ================= */}
            <Route path="/admin/login" element={<DashboardLoginPage />} />

            {/* ================= Auth Pages ================= */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/resetpass" element={<ResetPasswordPage />} />
            <Route path="/forgetpass" element={<ForgotPasswordPage />} />
            <Route path="/auth/callback" element={<OAuthCallbackPage />} />


            {/* ================= Fallback 404 ================= */}
            <Route path="*" element={<h1 className="p-8 text-2xl text-red-600">404 - Page Not Found</h1>} />

          </Routes>
        </Router>
      </SocketProvider>
    </ErrorBoundary>
  );
};

export default App;
