import { ThemeProvider } from "@/features/theme/context/ThemeContext";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import { ProfileProvider } from "@/features/profile/context/ProfileContext";
import { ApplicationsProvider } from "@/features/applications/context/ApplicationsContext";

const AppProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <ApplicationsProvider>{children}</ApplicationsProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
