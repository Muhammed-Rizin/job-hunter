import { ArrowUpRight, Download, FileText } from "lucide-react";
import { formatDateDisplay } from "../../utils/date";

const ProfileSummary = ({ profile, goal, currentCount, bouncedCount, progress, strokeDashoffset }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-500/10 pt-6 mt-4">
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50 mb-2">
            About
          </h3>
          <p className="text-xs leading-relaxed opacity-80">
            {profile.summary || "Add a quick summary to personalize your profile."}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50 mb-2">
            Skills
          </h3>
          <p className="text-xs leading-relaxed opacity-80">
            {profile.skills || "Add your primary skills and stack."}
          </p>
        </div>
        <div>
          <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50 mb-2">
            Contact
          </h3>
          <div className="space-y-2 text-xs opacity-80 font-mono break-words">
            <p>{profile.email || "Email not set"}</p>
            <p>{profile.mobile || "Phone not set"}</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50 mb-2">
            Compensation
          </h3>
          <div className="space-y-2 text-xs opacity-80">
            <p>Notice Period: {profile.noticePeriod || "Not set"}</p>
            <p>Current CTC: {profile.currentCtc || "Not set"}</p>
            <p>Expected CTC: {profile.expectedCtc || "Not set"}</p>
          </div>
        </div>
      </div>
      <div className="md:col-span-2 space-y-4">
        <div className="p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative overflow-hidden border-gray-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="z-10">
            <h3 className="font-bold text-sm tracking-wide mb-1">
              Goal: {goal.title || goal.targetRole || "Challenge"}
            </h3>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-4">
              Target: {goal.targetCount} jobs by {goal.targetDate ? formatDateDisplay(goal.targetDate) : "TBD"}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <div className="text-3xl font-mono font-bold tracking-tighter">
                    {currentCount}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest opacity-50">
                    Successful
                  </p>
               </div>
               <div>
                  <div className="text-3xl font-mono font-bold tracking-tighter text-red-500">
                    {bouncedCount}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest opacity-50 text-red-500/50">
                    Bounced
                  </p>
               </div>
            </div>
          </div>
          <div className="relative w-24 h-24 sm:mr-2 self-start sm:self-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-gray-200 dark:text-zinc-800"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-black dark:text-red-600"
                strokeDasharray={351}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-xl font-mono font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-gray-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50">Identity Package</h3>
            {profile.resumeLink ? (
              <a
                href={profile.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 font-bold flex items-center hover:underline"
              >
                View Cloud <ArrowUpRight size={12} className="ml-1" />
              </a>
            ) : null}
          </div>
          <div className="flex items-center gap-4 p-3 bg-white dark:bg-black rounded-2xl border border-slate-100 dark:border-zinc-800">
            <div className="p-3 bg-red-100 text-red-600 dark:bg-red-900/20 rounded-xl shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm truncate">{profile.resumeName || "RESUME_NOT_UPLOADED"}</p>
              <p className="text-[10px] opacity-50 uppercase font-black tracking-widest mt-0.5">Application Master</p>
            </div>
            <button className="p-2.5 bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-black dark:hover:text-white rounded-xl transition-all shadow-sm">
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
