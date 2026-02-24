import { Toaster } from "react-hot-toast";
import ScrollToTop from "@/shared/components/common/ScrollToTop";
import AppRoutes from "@/app/routes/AppRoutes";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-white text-black dark:bg-zinc-900 dark:text-white",
        }}
      />
      <AppRoutes />
    </>
  );
};

export default App;
