import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Key, Sun, Moon, Github, User, Mail } from "lucide-react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTheme } from "@/features/theme/context/ThemeContext";
import Card from "@/shared/components/common/Card";
import Input from "@/shared/components/common/Input";
import Button from "@/shared/components/common/Button";
import { API_URL } from "@/shared/config/app.config";
import { getDeviceId } from "@/shared/utils/device";

const AuthScreen = () => {
  const { login, register } = useAuth();
  const { toggleTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await register(formData);
      } else {
        // Map 'mobile' field to 'username' for the backend login expected format
        await login({ ...formData, username: formData.mobile });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    const deviceId = getDeviceId();
    window.location.href = `${API_URL}/auth/${provider}?deviceId=${encodeURIComponent(deviceId)}`;
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-6 dot-matrix transition-colors duration-500 bg-gray-50 text-gray-900 dark:bg-black dark:text-white`}
    >
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300`}
      >
        <Sun className="block dark:hidden" size={18} />
        <Moon className="hidden dark:block" size={18} />
      </button>

      <Card
        variants={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }}
        className="w-full max-w-sm p-8 rounded-3xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-black dark:bg-red-600" />

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-500">
            {isSignUp ? "Join JobHunter Pro" : "Login to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <>
              <Input
                icon={User}
                type="text"
                placeholder="Full Name"
                name="name"
                required
                value={formData.name || ""}
                onChange={handleValueChange}
              />

              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                name="email"
                required
                value={formData.email || ""}
                onChange={handleValueChange}
              />
            </>
          )}

          <Input
            icon={Smartphone}
            type={isSignUp ? "tel" : "text"}
            placeholder={isSignUp ? "Mobile Number" : "Mobile or Email"}
            name="mobile"
            required
            value={formData.mobile || ""}
            onChange={handleValueChange}
            autoComplete="username"
          />

          <Input
            icon={Key}
            type="password"
            placeholder="Password"
            name="password"
            required
            value={formData.password || ""}
            onChange={handleValueChange}
            autoComplete="current-password"
          />

          <Button loading={loading} type="submit">
            {isSignUp ? "Sign Up" : "Log In"}
          </Button>
        </form>

        <div className="my-6 flex items-center justify-center gap-4 opacity-50 text-xs uppercase font-bold">
          <div className="h-px bg-current w-12"></div>
          <span>Or continue with</span>
          <div className="h-px bg-current w-12"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SignUpAction Icon={GoogleIcon} onClick={() => handleOAuth("google")} />
          <SignUpAction Icon={Github} onClick={() => handleOAuth("github")} />
        </div>

        <p className="mt-6 text-[10px] text-center opacity-60">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold underline ml-1">
            {isSignUp ? "Log In" : "Sign Up"}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default AuthScreen;

const SignUpAction = ({ Icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-xl flex items-center justify-center border hover:bg-opacity-50 transition-colors bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300"
    >
      <Icon />
    </button>
  );
};
