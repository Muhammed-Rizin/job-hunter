import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const scrollContainer = document.getElementById("app-scroll-container");

    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
