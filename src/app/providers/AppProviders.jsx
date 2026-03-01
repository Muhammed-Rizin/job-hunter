import { ThemeProvider } from "@/features/theme/context/ThemeContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ProfileProvider } from "@/features/profile/context/ProfileContext";
import { ApplicationsProvider } from "@/features/applications/context/ApplicationsContext";
import { PlanningProvider } from "@/features/planning/context/PlanningContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <ApplicationsProvider>
            <PlanningProvider>{children}</PlanningProvider>
          </ApplicationsProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
