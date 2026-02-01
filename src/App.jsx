import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context";

import AuthScreen from "./pages/auth";
import Dashboard from "./pages/Dashboard";
// import DashboardView from "./pages/dashboard/DashboardView";
// import TrackerView from "./pages/tracker/TrackerView";
// import MailWizard from "./pages/mail/MailWizard";
// import NotesView from "./pages/notes/NotesView";
// import ProfileView from "./pages/profile/ProfileView";

const App = () => {
  const { isDark } = useTheme();
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: isDark ? "#333" : "#fff", color: isDark ? "#fff" : "#000" },
        }}
      />
      <Routes>
        <Route path="/login" element={<AuthScreen />} />

        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tracker" element={<Test />} />
          <Route path="mail" element={<Test />} />
          <Route path="notes" element={<Test />} />
          <Route path="profile" element={<Test />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;

const Test = () => {
  return <hi>Auth</hi>;
};
