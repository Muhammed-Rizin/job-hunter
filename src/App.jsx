import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/common/LoadingScreen";
import ScrollToTop from "./components/common/ScrollToTop";

import AuthScreen from "./pages/auth";
import OAuthCallback from "./pages/auth/OAuthCallback";
import Dashboard from "./pages/Dashboard";
import Tracker from "./pages/tracker";
import MailWizard from "./pages/mail";
import MailMenu from "./pages/mail/Menu";
import MailManual from "./pages/mail/Manual";
import MailTemplateList from "./pages/mail/TemplateList";
import MailTemplateCreate from "./pages/mail/TemplateCreate";
import MailTemplateEdit from "./pages/mail/TemplateEdit";
import MailTemplateFill from "./pages/mail/TemplateFill";
import MailTemplatePreview from "./pages/mail/TemplatePreview";
import Notes from "./pages/notes";
import Profile from "./pages/profile";
import Planning from "./pages/planning";
import NotFound from "./pages/not-found";

const App = () => {
  const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;
    if (user) return <Navigate to="/" replace />;

    return children;
  };

  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-white text-black dark:bg-zinc-900 dark:text-white",
        }}
      />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthScreen />
            </PublicRoute>
          }
        />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="planning" element={<Planning />} />
          <Route path="mail" element={<MailWizard />}>
            <Route index element={<MailMenu />} />
            <Route path="manual" element={<MailManual />} />
            <Route path="templates" element={<MailTemplateList />} />
            <Route path="templates/new" element={<MailTemplateCreate />} />
            <Route path="templates/:templateId/edit" element={<MailTemplateEdit />} />
            <Route path="templates/:templateId" element={<MailTemplateFill />} />
            <Route path="templates/:templateId/preview" element={<MailTemplatePreview />} />
          </Route>
          <Route path="notes" element={<Notes />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
