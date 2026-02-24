import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTheme } from "@/features/theme/context/ThemeContext";

import Header from "./Header";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import LoadingScreen from "@/shared/components/common/LoadingScreen";
import { AnimatePresence } from "framer-motion";

const ProtectedRoute = ({ children }) => {
  const { user, loading, serverReady } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!serverReady) return <LoadingScreen />;
  return children;
};

const MainLayout = () => {
  const { isMobile } = useTheme();

  return (
    <ProtectedRoute>
      <div className="h-dvh bg-gray-50 text-gray-900 dark:bg-black dark:text-white flex flex-col md:flex-row transition-colors duration-500 overflow-hidden">
        {!isMobile && <SideBar />}

        <main
          id="app-scroll-container"
          className="flex-1 h-full overflow-y-auto no-scrollbar pt-20 pb-32 md:pt-0 md:pr-4 md:pb-4 scroll-smooth"
        >
          <Header />
          <div className="max-w-6xl mx-auto min-h-full flex flex-col p-4 md:p-6 lg:p-8">
            <div className="mt-0 flex-1 min-h-0">
              <AnimatePresence mode="wait">
                <Outlet />
              </AnimatePresence>
            </div>
          </div>
        </main>

        {isMobile && <NavBar />}
      </div>
    </ProtectedRoute>
  );
};

export default MainLayout;
