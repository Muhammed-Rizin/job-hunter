import { itemVariants } from "@/shared/utils/animations";
import { colors } from "@/shared/utils/theme";
import Card from "@/shared/components/common/Card";

const StatWidget = ({ title, value, icon: Icon, accent, onClick }) => (
  <Card
    variants={itemVariants}
    className={`p-4 flex flex-col justify-between shadow-sm h-full ${onClick ? "cursor-pointer hover:border-red-500/50 active:scale-95" : ""} transition-all`}
    onClick={onClick}
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{title}</span>
      <Icon size={16} className="opacity-30" />
    </div>
    <div>
      <span
        className={`text-2xl font-mono font-bold tracking-tight ${accent ? colors.accent : ""}`}
      >
        {value ?? 0}
      </span>
    </div>
  </Card>
);

export default StatWidget;
