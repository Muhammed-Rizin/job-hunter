import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const Tooltip = ({
  content,
  children,
  position = "top",
  className = "",
  fullWidth = false,
  disabled = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top + scrollY - 8;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + scrollY + 8;
        left = rect.left + scrollX + rect.width / 2;
        break;
      case "left":
        top = rect.top + scrollY + rect.height / 2;
        left = rect.left + scrollX - 8;
        break;
      case "right":
        top = rect.top + scrollY + rect.height / 2;
        left = rect.right + scrollX + 8;
        break;
      default:
        top = rect.top + scrollY - 8;
        left = rect.left + scrollX + rect.width / 2;
    }

    setCoords({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener("scroll", calculatePosition, true);
      window.addEventListener("resize", calculatePosition);
    }
    return () => {
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [isVisible, position]);

  if (!content || disabled) return children;

  const getAnimateProps = () => {
    switch (position) {
      case "top":
        return {
          initial: { opacity: 0, y: 10, x: "-50%" },
          animate: { opacity: 1, y: 0, x: "-50%" },
          exit: { opacity: 0, y: 10, x: "-50%" },
          style: { top: coords.top, left: coords.left, transformOrigin: "bottom" },
          className: "-translate-y-full",
        };
      case "bottom":
        return {
          initial: { opacity: 0, y: -10, x: "-50%" },
          animate: { opacity: 1, y: 0, x: "-50%" },
          exit: { opacity: 0, y: -10, x: "-50%" },
          style: { top: coords.top, left: coords.left, transformOrigin: "top" },
        };
      case "left":
        return {
          initial: { opacity: 0, x: 10, y: "-50%" },
          animate: { opacity: 1, x: 0, y: "-50%" },
          exit: { opacity: 0, x: 10, y: "-50%" },
          style: { top: coords.top, left: coords.left, transformOrigin: "right" },
          className: "-translate-x-full",
        };
      case "right":
        return {
          initial: { opacity: 0, x: -10, y: "-50%" },
          animate: { opacity: 1, x: 0, y: "-50%" },
          exit: { opacity: 0, x: -10, y: "-50%" },
          style: { top: coords.top, left: coords.left, transformOrigin: "left" },
        };
      default:
        return {};
    }
  };

  const animateProps = getAnimateProps();

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`${fullWidth ? "flex w-full" : "inline-flex"} ${className}`}
      >
        {children}
      </div>
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              {...animateProps}
              role="tooltip"
              className={`fixed pointer-events-none z-[100000] whitespace-normal max-w-[180px] rounded-lg border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-center bg-black text-white border-white/10 backdrop-blur-md shadow-2xl dark:bg-white dark:text-black dark:border-black/5 ${animateProps.className || ""}`}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default Tooltip;
