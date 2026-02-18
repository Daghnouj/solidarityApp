// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import QuickActionsMenu from "../menus/QuickActionsMenu";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating Quick Actions Menu */}
      <QuickActionsMenu position="bottom-right" />
    </div>
  );
};

export default Layout;
