import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import Header from "./Header";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import LoadingScreen from "../components/common/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
import { containerVariants } from "../utils/animations";

const ProtectedRoute = ({ children }) => {
  const { user, loading, serverReady } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (!serverReady) return <LoadingScreen />;

  return children;
};

const MainLayout = () => {
  const { isMobile } = useTheme();
  const location = useLocation();

  return (
    <ProtectedRoute>
      <div
        className={`h-dvh bg-gray-50 text-gray-900 dark:bg-black dark:text-white flex flex-col md:flex-row transition-colors duration-500 overflow-hidden`}
      >
        {!isMobile && <SideBar />}

        {/* <main className="flex-1 h-full overflow-y-auto no-scrollbar pt-20 pb-32 md:py-4 md:pr-4 md:pb-4 scroll-smooth"> */}
        <main className="flex-1 h-full overflow-y-auto no-scrollbar pt-20 pb-32 md:pt-0 md:pr-4 md:pb-4 scroll-smooth">
          <div className="max-w-6xl mx-auto min-h-full flex flex-col">
            <Header />
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </div>
        </main>

        {isMobile && <NavBar />}
      </div>
    </ProtectedRoute>
  );
};

export default MainLayout;
