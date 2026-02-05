import { motion } from "framer-motion";
import { containerVariants } from "../../utils/animations";

const MailPage = ({ children, className = "" }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className={`w-full max-w-6xl mx-auto px-4 md:px-0 pt-4 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default MailPage;
