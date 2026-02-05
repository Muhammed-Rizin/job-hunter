import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className="flex-1 h-full flex flex-col items-center justify-center space-y-4 p-4 md:px-0"
    >
      <div className="p-8 rounded-full mb-6 bg-gray-100 dark:bg-zinc-800/50">
        <AlertCircle size={64} className="opacity-20" />
      </div>
      <h2 className="text-3xl font-extrabold mb-2">Page Not Found</h2>
      <p className="text-sm opacity-50 max-w-xs text-center mb-8 text-gray-500 dark:text-zinc-400">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <button
        onClick={() => navigate("/")}
        className={`px-8 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform ${colors.primary}`}
      >
        Back to Dashboard
      </button>
    </motion.div>
  );
};

export default NotFound;
