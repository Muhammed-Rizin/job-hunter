import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { fetchCurrentProfile } from "@/features/profile/services/profile.service";
import Card from "@/shared/components/common/Card";
import { clearSession, setStoredUser, setTokens } from "@/shared/utils/session";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { updateUser } = useAuth();

  useEffect(() => {
    const finalizeOAuth = async () => {
      const accessToken = params.get("accessToken");
      const refreshToken = params.get("refreshToken");

      if (!accessToken || !refreshToken) {
        navigate("/login?oauth=failed", { replace: true });
        return;
      }

      setTokens({ accessToken, refreshToken });

      try {
        const profile = await fetchCurrentProfile();
        if (profile) {
          setStoredUser(profile);
          updateUser(profile);
        }
        navigate("/", { replace: true });
      } catch (error) {
        clearSession();
        navigate("/login?oauth=failed", { replace: true });
      }
    };

    finalizeOAuth();
  }, [navigate, params, updateUser]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 text-gray-900 dark:bg-black dark:text-white">
      <Card className="p-6 rounded-2xl shadow-sm">
        <p className="text-sm font-bold">Finishing sign-in...</p>
        <p className="text-xs opacity-60 mt-2">Please wait while we verify your account.</p>
      </Card>
    </div>
  );
};

export default OAuthCallback;
