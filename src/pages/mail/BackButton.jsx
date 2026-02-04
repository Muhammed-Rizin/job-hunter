import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MailBackButton = ({ to, onClick, className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => (onClick ? onClick() : to ? navigate(to) : navigate(-1))}
      className={`gap-2 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-widest opacity-70 hover:opacity-100 hover:bg-gray-500/10 transition mb-3 ${className}`}
    >
      <ChevronLeft size={20} />
    </button>
  );
};

export default MailBackButton;
