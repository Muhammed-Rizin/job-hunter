import { Calendar, MoreHorizontal, Trash2 } from "lucide-react";
import { PLATFORMS } from "@/features/applications/constants/job.constants";
import { formatDateDisplay } from "@/shared/utils/date";
import Tooltip from "@/shared/components/common/Tooltip";
import StatusSelect from "@/features/applications/components/StatusSelect";

const TrackerCard = ({ app, colors, onDelete, onStatusChange, onDetails }) => {
  return (
    <div
      onClick={() => onDetails?.(app)}
      className={`p-3 rounded-2xl border ${colors.card} shadow-sm transition-shadow hover:shadow-md cursor-pointer`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2.5 rounded-full flex items-center justify-center shrink-0 border bg-blue-50 border-blue-100 shadow-sm text-blue-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white">
            <span className="font-bold text-sm">{(app.company || "?").charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm tracking-wide leading-none mb-1">
              {app.company || "Unknown Company"}
            </h4>
            <p className="text-[10px] uppercase tracking-widest opacity-50 text-gray-500 dark:text-zinc-400">
              {app.role || "-"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="More Options">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMore?.(app);
              }}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors p-1"
              aria-label="More options"
            >
              <MoreHorizontal size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Delete Application">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(app);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              aria-label="Delete application"
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-2 border-t border-dashed border-gray-500/20">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-widest opacity-60">
          {(() => {
            const match = PLATFORMS.find((p) => p.id === app.source);
            const Icon = match?.icon;
            return Icon ? <Icon size={12} /> : null;
          })()}
          <span className="mr-auto">
            {PLATFORMS.find((p) => p.id === app.source)?.label || app.source}
          </span>
        </div>
        {app.statusDetails?.date || app.statusDetails?.round || app.statusDetails?.mode ? (
          <div className="text-[10px] opacity-60">
            {app.statusDetails?.round ? `${app.statusDetails.round}` : ""}
            {app.statusDetails?.mode
              ? `${app.statusDetails.round ? " - " : ""}${app.statusDetails.mode}`
              : ""}
            {app.statusDetails?.date
              ? `${app.statusDetails.round || app.statusDetails.mode ? " - " : ""}${formatDateDisplay(app.statusDetails.date)}`
              : ""}
            {app.statusDetails?.time ? ` ${app.statusDetails.time}` : ""}
          </div>
        ) : null}
        <div className="flex items-center gap-3">
          <div className="flex-1" onClick={(e) => e.stopPropagation()}>
            <StatusSelect status={app.status} onChange={(v) => onStatusChange?.(app, v)} />
          </div>
          <div className="flex items-center gap-1 opacity-50 text-[10px] font-mono font-bold">
            <Calendar size={10} />
            <span>{formatDateDisplay(app.appliedDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackerCard;
