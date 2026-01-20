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

// Pages - Auth
import LoginForm from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// Pages - Admin Dashboard
import OverviewPage from "./dashboard/OverviewPage";
import UsersPage from "./dashboard/UsersPage";
import RequestsPage from "./dashboard/RequestsPage";
import ActivitiesCentersPage from "./dashboard/ActivitiesCentersPage";
import GalleryPage from "./dashboard/GalleryPage";
import AdminProfilePage from "./dashboard/AdminProfilePage";
import DashboardLoginPage from "./dashboard/DashboardLoginPage";

// Components
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./pages/ProfessionalProfile/components/ErrorBoundary";

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />

        <Routes>

          {/* ================= Public Layout ================= */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/professionals/:id" element={<ProfessionalProfile />} />
            <Route path="/book/:therapistId" element={<BookingPage />} />
            <Route path="/activities-centers" element={<ActivitiesCenters />} />
            <Route path="/community" element={<Community />} />
            <Route path="/galerie" element={<Galerie />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

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

          {/* ================= Admin Login (no dashboard layout) ================= */}
          <Route path="/admin/login" element={<DashboardLoginPage />} />

          {/* ================= Auth Pages ================= */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/resetpass" element={<ResetPasswordPage />} />
          <Route path="/forgetpass" element={<ForgotPasswordPage />} />

          {/* ================= Fallback 404 ================= */}
          <Route path="*" element={<h1 className="p-8 text-2xl text-red-600">404 - Page Not Found</h1>} />

        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
