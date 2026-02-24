import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Card from "@/shared/components/common/Card";
import { setTokens } from "@/shared/utils/session";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (!accessToken || !refreshToken) {
      navigate("/login");
      return;
    }

    setTokens({ accessToken, refreshToken });
    window.location.href = "/";
  }, [navigate, params]);

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
