import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/shared/components/common/ScrollToTop";
import AppRoutes from "@/app/routes/AppRoutes";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "dark:bg-zinc-900 bg-white dark:text-white text-zinc-900 border border-black/5 dark:border-white/10 shadow-2xl rounded-2xl px-6 py-4 font-bold text-xs tracking-wide",
          duration: 3500,
        }}
      />
      <AppRoutes />
    </>
  );
};

export default App;
