import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-14 h-14 mb-4 rounded-xl flex items-center justify-center shadow-lg bg-black dark:bg-red-600">
          <Briefcase size={28} className="text-white" />
        </div>

        <h1 className="text-xl font-bold tracking-widest font-sans dark:font-mono">JH PRO</h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 1.4,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="h-1 mt-4 rounded-full bg-black dark:bg-red-600"
          style={{ minWidth: "80px" }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
