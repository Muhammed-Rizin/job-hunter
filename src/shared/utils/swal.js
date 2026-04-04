import Swal from "sweetalert2";

const isDarkMode = () => document.documentElement.classList.contains("dark");

export const themeSwal = Swal.mixin({
  customClass: {
    popup: "rounded-[32px] border shadow-2xl overflow-hidden",
    title: "text-2xl md:text-3xl font-black tracking-tight mb-4 text-balance",
    htmlContainer: "text-sm md:text-base leading-relaxed opacity-60 font-medium px-6 mb-2",
    confirmButton:
      "px-10 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl m-2",
    cancelButton:
      "px-10 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all duration-500 hover:scale-105 active:scale-95 m-2 border",
    actions: "flex justify-center gap-6 mt-12 mb-4",
  },
  buttonsStyling: false,
  backdrop: `rgba(0, 0, 0, 0.6)`,
  showClass: {
    popup: "animate-slide-up",
  },
  didOpen: (popup) => {
    const isDark = isDarkMode();
    const container = Swal.getContainer();
    if (container) {
      container.style.backdropFilter = "blur(4px)";
      container.style.webkitBackdropFilter = "blur(4px)";
    }

    popup.style.background = isDark ? "#18181b" : "#ffffff"; // zinc-900 / white
    popup.style.borderColor = isDark ? "#27272a" : "#f3f4f6"; // zinc-800 / gray-100
    popup.style.fontFamily = isDark ? "'JetBrains Mono', monospace" : "'Inter', sans-serif";
    popup.style.color = isDark ? "#ffffff" : "#0f172a";
    popup.style.borderRadius = "32px";

    const confirmBtn = popup.querySelector(".swal2-confirm");
    const cancelBtn = popup.querySelector(".swal2-cancel");

    if (confirmBtn) {
      confirmBtn.style.backgroundColor = isDark ? "#ef4444" : "#0f172a";
      confirmBtn.style.color = "#ffffff";
      confirmBtn.style.borderRadius = "14px";
      confirmBtn.style.boxShadow = isDark
        ? "0 20px 25px -5px rgba(239, 68, 68, 0.2)"
        : "0 20px 25px -5px rgba(0, 0, 0, 0.2)";
    }

    if (cancelBtn) {
      cancelBtn.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc";
      cancelBtn.style.borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
      cancelBtn.style.color = isDark ? "#94a3b8" : "#64748b";
      cancelBtn.style.borderRadius = "14px";

      cancelBtn.addEventListener("mouseenter", () => {
        cancelBtn.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f5f9";
        cancelBtn.style.color = isDark ? "#ffffff" : "#0f172a";
        cancelBtn.style.borderColor = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)";
      });
      cancelBtn.addEventListener("mouseleave", () => {
        cancelBtn.style.backgroundColor = isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc";
        cancelBtn.style.color = isDark ? "#94a3b8" : "#64748b";
        cancelBtn.style.borderColor = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)";
      });
    }
  },
});

export const confirmDelete = async (
  title = "Are you sure?",
  text = "This action cannot be undone."
) => {
  return themeSwal.fire({
    title,
    text,
    icon: "warning",
    iconColor: isDarkMode() ? "#ef4444" : "#0f172a",
    showCancelButton: true,
    confirmButtonText: "Confirm Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });
};

export const showSuccess = async (title = "Success!", text = "") => {
  return themeSwal.fire({
    title,
    text,
    icon: "success",
    iconColor: isDarkMode() ? "#22c55e" : "#10b981",
    timer: 2000,
    showConfirmButton: false,
  });
};
