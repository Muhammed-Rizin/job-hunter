import { Loader2 } from "lucide-react";

const Button = ({ children, variant = "primary", className = "", loading = false, ...props }) => {
  const variants = {
    primary: "bg-black text-white hover:bg-zinc-800 dark:bg-red-600 dark:hover:bg-red-500",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  };

  return (
    <button
      {...props}
      disabled={loading}
      className={`w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider
        shadow-lg transform active:scale-95 transition-all flex items-center justify-center
        ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : children}
    </button>
  );
};

export default Button;
