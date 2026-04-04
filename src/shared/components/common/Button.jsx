import { Loader2 } from "lucide-react";

const Button = ({ children, variant = "primary", className = "", loading = false, ...props }) => {
  const variants = {
    primary:
      "bg-black text-white hover:bg-zinc-800 dark:bg-red-600 dark:hover:bg-red-500 shadow-lg",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 shadow-sm",
    danger: "bg-red-600/10 text-red-600 border border-red-600/20 hover:bg-red-600 hover:text-white",
  };

  return (
    <button
      {...props}
      disabled={loading}
      className={`w-full py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-widest
        transform active:scale-95 transition-all flex items-center justify-center cursor-pointer
        ${variants[variant]} ${className}`}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
};

export default Button;
