import { motion } from "framer-motion";
import { itemVariants } from "../../utils/animations";

const MailPage = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`w-full max-w-6xl mx-auto px-4 md:px-0 pt-4 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default MailPage;
