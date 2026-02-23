import { ArrowUpRight, Download, FileText } from "lucide-react";
import { formatDateDisplay } from "../../utils/date";

const ProfileSummary = ({ profile, goal, currentCount, bouncedCount, progress, strokeDashoffset }) => {
  return (
    <div className="grid md:grid-cols-3 gap-6 border-t border-gray-500/10 pt-6 mt-4">
      <div className="space-y-4">
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
        <div className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden border-gray-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="z-10">
            <h3 className="font-bold text-sm tracking-wide mb-1">
              Goal: {goal.title || goal.targetRole || "Challenge"}
            </h3>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-3">
              Target: {goal.targetCount}
            </p>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-3">
              Deadline: {goal.targetDate ? formatDateDisplay(goal.targetDate) : "Not set"}
            </p>
            <div className="text-3xl font-mono font-bold tracking-tighter">
              {currentCount}
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-4">
              Total Applications
            </p>
            
            <div className="text-xl font-mono font-bold tracking-tighter text-orange-500">
              {bouncedCount}
            </div>
            <p className="text-[10px] uppercase tracking-widest opacity-50">
              Bounced Emails
            </p>
          </div>
          <div className="relative w-24 h-24 sm:mr-2 self-end sm:self-auto">
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

        <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-[10px] uppercase tracking-widest opacity-50">Resume</h3>
            {profile.resumeLink ? (
              <a
                href={profile.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 font-bold flex items-center"
              >
                Open Link <ArrowUpRight size={10} className="ml-1" />
              </a>
            ) : null}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <FileText size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-xs">{profile.resumeName || "No resume uploaded"}</p>
              <p className="text-[10px] opacity-50">PDF Document</p>
            </div>
            <button className="sm:ml-auto p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;
