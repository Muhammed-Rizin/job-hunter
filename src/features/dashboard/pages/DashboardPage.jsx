import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, AlertCircle, Briefcase, Calendar, Check, Clock } from "lucide-react";

import { useApplications } from "@/features/applications/context/ApplicationsContext";
import { useProfile } from "@/features/profile/context/ProfileContext";
import { containerVariants } from "@/shared/utils/animations";
import { formatDateDisplay } from "@/shared/utils/date";
import StatWidget from "@/features/dashboard/components/StatWidget";
import Card from "@/shared/components/common/Card";

const toStatusLabel = (status = "") =>
  String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const Dashboard = () => {
  const { applications } = useApplications();
  const { goal, stats } = useProfile();
  const navigate = useNavigate();

  const goalWindowStart = stats?.goalWindowStart || goal?.startDate;
  const goalWindowEnd = stats?.goalWindowEnd || goal?.targetDate;
  const hasGoalWindow = Boolean(goalWindowStart && goalWindowEnd);
  const daysLeft = hasGoalWindow
    ? Math.ceil((new Date(goalWindowEnd) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalApplied = stats?.totalApps || 0;
  const nonBouncedApplied = stats?.appliedApps || 0;
  const goalWindowApplied = stats?.goalWindowApplied || 0;
  const bouncedCount = stats?.bouncedApps || 0;
  const pendingPlans = stats?.pendingApps || 0;
  const offerCount = stats?.offerApps || 0;
  const appsToday = stats?.appsToday || 0;

  const progress =
    goal?.targetCount > 0
      ? Math.min(100, (goalWindowApplied / goal.targetCount) * 100)
      : goalWindowApplied > 0
        ? 100
        : 0;

  const circumference = 351;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const recentActivity = useMemo(() => (applications || []).slice(0, 6), [applications]);

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={containerVariants} className="h-full">
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card hover={false} className="p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex justify-between items-start z-10 relative">
              <div>
                <h3 className="font-bold text-sm tracking-wide">Goal Progress</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-50">
                  {goal.title || goal.targetRole || "Challenge"}
                </p>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-1">
                  {goalWindowStart ? formatDateDisplay(goalWindowStart) : "TBD"} to {goalWindowEnd ? formatDateDisplay(goalWindowEnd) : "TBD"}
                </p>
              </div>
              <div className="px-2 py-1 rounded-md text-[10px] font-bold border bg-gray-100 border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
                {hasGoalWindow ? `${daysLeft} Days Left` : "No Window"}
              </div>
            </div>
            <div className="flex items-end mt-4 relative z-10">
              <div className="relative w-24 h-24 mr-6 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-100 dark:text-zinc-800" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-black dark:text-red-600"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xl font-mono font-bold">{Math.round(progress)}%</span>
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-mono font-bold tracking-tighter">{goalWindowApplied}</p>
                  {goal?.targetCount > 0 ? <p className="text-xs opacity-30 font-bold">/ {goal.targetCount}</p> : null}
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold mt-1">In Goal Window</p>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <StatWidget title="Applied Today" value={appsToday} icon={Calendar} />
            <StatWidget title="Applied Total" value={totalApplied} icon={Briefcase} onClick={() => navigate("/tracker")} />
            <StatWidget title="Planning Pending" value={pendingPlans} icon={Clock} onClick={() => navigate("/planning")} />
            <StatWidget title="Offers" value={offerCount} icon={Check} accent />
            <StatWidget
              title="Bounced"
              value={bouncedCount}
              icon={AlertCircle}
              onClick={() => navigate("/tracker", { state: { activeTab: "bounced" } })}
            />
            <StatWidget title="Successful" value={nonBouncedApplied} icon={Activity} onClick={() => navigate("/tracker")} />
          </div>
        </div>

        <Card className="p-5 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm tracking-wide flex items-center">
              <Activity size={16} className="mr-2 opacity-50" /> Recent Activity
            </h3>
            <button className="text-[10px] font-bold uppercase opacity-50 hover:opacity-100" onClick={() => navigate("/tracker")}>
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((app) => (
              <div key={app.id || app._id} className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs">{app.company || "Unknown Company"}</p>
                  <p className="text-[10px] opacity-50 uppercase tracking-widest font-black">{toStatusLabel(app.status)}</p>
                </div>
                <span className="text-[10px] font-mono opacity-50">{formatDateDisplay(app.appliedDate)}</span>
              </div>
            ))}
            {recentActivity.length === 0 ? <p className="text-xs opacity-50 py-4 text-center">No recent activity</p> : null}
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default Dashboard;
