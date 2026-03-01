import { motion } from "framer-motion";
import { colors } from "@/shared/utils/theme";
import { itemVariants } from "@/shared/utils/animations";

/**
 * Reusable Card component
 *
 * @param {ReactNode} children
 * @param {string} className
 * @param {boolean} hover
 * @param {boolean} glass
 * @param {object} variants - framer-motion specific props
 * @param {object} rest - normal div props (onClick, id, etc.)
 */
const Card = ({
  children,
  className = "",
  hover = true,
  glass = false,
  variants = itemVariants,
  ...rest
}) => {
  const base = `transition-colors duration-300 bg-white border border-gray-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800`;
  const hoverStyle = hover ? "hover:shadow-md dark:hover:shadow-black/40" : "";
  const glassStyle = glass ? "bg-white/90 dark:bg-black/80 backdrop-blur-md" : "";

  return (
    <motion.div
      {...rest}
      layout
      variants={variants}
      className={[base, colors.card, hoverStyle, glassStyle, className].join(" ")}
    >
      {children}
    </motion.div>
  );
};

export default Card;
