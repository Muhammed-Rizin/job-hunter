import React from "react";
import { useApplications } from "@/features/applications/context/ApplicationsContext";
import { useProfile } from "@/features/profile/context/ProfileContext";

import { motion } from "framer-motion";
import { containerVariants } from "@/shared/utils/animations";
import { formatDateDisplay } from "@/shared/utils/date";

import { Activity, Calendar, Check, Clock, AlertCircle, Briefcase } from "lucide-react";
import StatWidget from "@/features/dashboard/components/StatWidget";
import Card from "@/shared/components/common/Card";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { applications } = useApplications();
  const { goal, profile, stats } = useProfile();
  const navigate = useNavigate();

  const hasTargetDate = Boolean(goal?.targetDate);
  const daysLeft = hasTargetDate
    ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  // Safe access for stats to prevent production crashes
  const totalSuccessful = stats?.appliedApps || 0;
  const bouncedCount = stats?.bouncedApps || 0;
  const pendingPlans = stats?.pendingApps || 0;
  const offerCount = stats?.offerApps || 0;
  const appsToday = stats?.appsToday || 0;
  const totalApplied = stats?.totalApps || 0; // Added for applied count card

  const progress =
    goal?.targetCount > 0 ? Math.min(100, (totalSuccessful / goal.targetCount) * 100) : (totalSuccessful > 0 ? 100 : 0);
  const circumference = 351;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getStatusColor = (status) => {
    switch (status) {
      case "offer": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "interview":
      case "technical":
      case "hr_contact": return "bg-amber-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="h-full"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card
            hover={false}
            className="p-6 rounded-3xl shadow-sm relative overflow-hidden flex flex-col justify-between h-auto min-h-5"
          >
            <div className="flex justify-between items-start z-10 relative">
              <div>
                <h3 className="font-bold text-sm tracking-wide">Goal Progress</h3>
                <p className={`text-[10px] uppercase tracking-widest opacity-50`}>
                  {goal.title || goal.targetRole || "Challenge"}
                </p>
              </div>
              <div className="px-2 py-1 rounded-md text-[10px] font-bold border bg-gray-100 border-gray-200 dark:bg-zinc-800 dark:border-zinc-700 ">
                {hasTargetDate ? `${daysLeft} Days Left` : "No Deadline"}
              </div>
            </div>
            <div className="flex items-end mt-4 relative z-10">
              <div className="relative w-24 h-24 mr-6 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-100 dark:text-zinc-800"
                  />
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
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-mono font-bold tracking-tighter">
                      {totalSuccessful}
                    </p>
                    {goal?.targetCount > 0 && <p className="text-xs opacity-30 font-bold">/ {goal.targetCount}</p>}
                  </div>
                  <p className={`text-[10px] uppercase tracking-widest opacity-50 font-bold mt-1`}>
                    Successful Apps
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            <StatWidget title="Applied Today" value={appsToday} icon={Calendar} />
            <StatWidget
              title="Applied Total"
              value={totalApplied}
              icon={Briefcase}
              onClick={() => navigate("/tracker")}
            />
            <StatWidget
              title="Planning"
              value={pendingPlans}
              icon={Clock}
              onClick={() => navigate("/planning")}
            />
            <StatWidget
              title="Offers"
              value={offerCount}
              icon={Check}
              accent
            />
            <StatWidget
              title="Bounced"
              value={bouncedCount}
              icon={AlertCircle}
              onClick={() => navigate("/tracker", { state: { activeTab: "bounced" } })}
            />
            <StatWidget
              title="Successful"
              value={totalSuccessful}
              icon={Activity}
              onClick={() => navigate("/tracker")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
          <Card className="p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm tracking-wide flex items-center">
                <Activity size={16} className="mr-2 opacity-50" /> Recent Activity
              </h3>
              <button
                className="text-[10px] font-bold uppercase opacity-50 hover:opacity-100"
                onClick={() => navigate("/tracker")}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {(applications || []).slice(0, 3).map((app) => (
                <div key={app.id || app._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${getStatusColor(app.status)}`}
                    ></div>
                    <div>
                      <p className="font-bold text-xs">{app.company}</p>
                      <p className="text-[10px] opacity-50 uppercase tracking-widest font-black">
                        {app.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono opacity-50">
                    {formatDateDisplay(app.appliedDate)}
                  </span>
                </div>
              ))}
              {(!applications || applications.length === 0) && (
                <p className="text-xs opacity-50 py-4 text-center">No recent activity</p>
              )}
            </div>
          </Card>

          <Card className="p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm tracking-wide flex items-center">
                <Briefcase size={16} className="mr-2 opacity-50" /> Active Processes
              </h3>
              <button
                className="text-[10px] font-bold uppercase opacity-50 hover:opacity-100"
                onClick={() => navigate("/tracker")}
              >
                View Pipeline
              </button>
            </div>
            <div className="space-y-3">
              {applications
                ?.filter((app) => ["interview", "technical", "hr_contact"].includes(app.status))
                .slice(0, 3)
                .map((app) => (
                  <div key={app.id || app._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border bg-gray-50 dark:bg-black border-gray-200 dark:border-zinc-800">
                        <span className="font-bold text-xs">{(app.company || "?").charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-bold text-xs">{app.company}</p>
                        <p className="text-[10px] text-amber-500 uppercase tracking-widest font-black">
                          {app.statusDetails?.round || app.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 px-2 py-1 rounded-md">
                      {app.statusDetails?.date ? formatDateDisplay(app.statusDetails.date) : "Pending"}
                    </span>
                  </div>
                ))}
              {applications?.filter((app) => ["interview", "technical", "hr_contact"].includes(app.status)).length === 0 && (
                <p className="text-xs opacity-50 py-4 text-center">No active interviews</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
