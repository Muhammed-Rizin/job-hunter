import { itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import Card from "../common/Card";

const StatWidget = ({ title, value, icon: Icon, accent }) => (
  <Card variants={itemVariants} className="p-4 flex flex-col justify-between shadow-sm h-full">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[10px] uppercase tracking-widest opacity-50 font-bold">{title}</span>
      <Icon size={16} className="opacity-30" />
    </div>
    <div>
      <span
        className={`text-2xl font-mono font-bold tracking-tight ${accent ? colors.accent : ""}`}
      >
        {value}
      </span>
    </div>
  </Card>
);

export default StatWidget;
