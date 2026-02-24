import { Calendar, Trash2 } from "lucide-react";
import { APPLICATION_STATUSES, PLATFORMS } from "@/features/applications/constants/job.constants";
import { formatDateDisplay } from "@/shared/utils/date";
import Tooltip from "@/shared/components/common/Tooltip";

const TrackerCard = ({ app, colors, onDelete, onStatusChange, onDetails }) => {
  return (
    <div className={`p-3 rounded-2xl border ${colors.card} shadow-sm transition-shadow hover:shadow-md`}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="p-2.5 rounded-full flex items-center justify-center shrink-0 border bg-blue-50 border-blue-100 shadow-sm text-blue-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
          >
            <span className="font-bold text-sm">{(app.company || "?").charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm tracking-wide leading-none mb-1">
              {app.company || "Unknown Company"}
            </h4>
            <p
              className="text-[10px] uppercase tracking-widest opacity-50 text-gray-500 dark:text-zinc-400"
            >
              {app.role || "-"}
            </p>
          </div>
        </div>
        <Tooltip content="Delete Application">
          <button
            onClick={() => onDelete?.(app)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            aria-label="Delete application"
          >
            <Trash2 size={16} />
          </button>
        </Tooltip>
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
          <Tooltip content="Open Status Details">
            <button
              onClick={() => onDetails?.(app)}
              className="text-[10px] font-bold uppercase tracking-widest opacity-60 hover:opacity-100"
            >
              Details
            </button>
          </Tooltip>
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
          <select
            className={`custom-select px-3 py-2 rounded-xl outline-none font-bold text-xs uppercase tracking-wide ${colors.input} flex-1`}
            value={app.status}
            onChange={(e) => onStatusChange?.(app, e.target.value)}
          >
            {APPLICATION_STATUSES.filter((s) => s.id !== "all").map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
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

