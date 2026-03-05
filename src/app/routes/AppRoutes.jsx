import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import AuthPage from "@/features/auth/pages/AuthPage";
import OAuthCallbackPage from "@/features/auth/pages/OAuthCallbackPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import TrackerPage from "@/features/applications/pages/TrackerPage";
import ApplicationDetailPage from "@/features/applications/pages/ApplicationDetailPage";
import PlanningPage from "@/features/planning/pages/PlanningPage";
import MailWizardPage from "@/features/mail/pages/MailWizardPage";
import MailMenuPage from "@/features/mail/pages/MailMenuPage";
import MailManualPage from "@/features/mail/pages/MailManualPage";
import MailTemplateListPage from "@/features/mail/pages/MailTemplateListPage";
import MailTemplateCreatePage from "@/features/mail/pages/MailTemplateCreatePage";
import MailTemplateEditPage from "@/features/mail/pages/MailTemplateEditPage";
import MailTemplateFillPage from "@/features/mail/pages/MailTemplateFillPage";
import MailTemplatePreviewPage from "@/features/mail/pages/MailTemplatePreviewPage";
import ProfilePage from "@/features/profile/pages/ProfilePage";
import NotFoundPage from "@/features/not-found/pages/NotFoundPage";
import MainLayout from "@/shared/layout/MainLayout";
import LoadingScreen from "@/shared/components/common/LoadingScreen";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/" replace />;

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tracker" element={<TrackerPage />} />
        <Route path="tracker/:id" element={<ApplicationDetailPage />} />
        <Route path="planning" element={<PlanningPage />} />
        <Route path="mail" element={<MailWizardPage />}>
          <Route index element={<MailMenuPage />} />
          <Route path="manual" element={<MailManualPage />} />
          <Route path="templates" element={<MailTemplateListPage />} />
          <Route path="templates/new" element={<MailTemplateCreatePage />} />
          <Route path="templates/:templateId/edit" element={<MailTemplateEditPage />} />
          <Route path="templates/:templateId" element={<MailTemplateFillPage />} />
          <Route path="templates/:templateId/preview" element={<MailTemplatePreviewPage />} />
        </Route>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
