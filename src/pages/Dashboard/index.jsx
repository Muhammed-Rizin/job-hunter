import React from "react";
import { useGlobal } from "../../context";

import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../utils/animations";
import { colors } from "../../utils/theme";
import { formatDateDisplay } from "../../utils/date";

import { Activity, Calendar, Check, Clock, User, AlertCircle } from "lucide-react";
import StatWidget from "../../components/cards/StatWidget";
import Card from "../../components/common/Card";

const Dashboard = () => {
  const { applications, bouncedApps, goal, profile, stats, fetchStats } = useGlobal();

  const hasTargetDate = Boolean(goal?.targetDate);
  const daysLeft = hasTargetDate
    ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24))
    : 0;
  const progress =
    goal.targetCount > 0 ? Math.min(100, (stats.totalApps / goal.targetCount) * 100) : 0;
  const circumference = 351;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const appsToday = applications.filter(
    (a) => a.appliedDate === new Date().toISOString().split("T")[0],
  ).length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      className="h-full"
    >
      <div className="space-y-4 p-4 md:px-0">
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
                <p className="text-3xl font-mono font-bold tracking-tighter">
                  {stats.totalApps}
                </p>
                <p className={`text-[10px] uppercase tracking-widest opacity-50`}>
                  Successful Apps
                </p>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
            <StatWidget title="Applied Today" value={appsToday} icon={Calendar} />
            <StatWidget 
              title="Failed/Bounced" 
              value={stats.bouncedApps} 
              icon={AlertCircle} 
            />
            <StatWidget
              title="Awaiting Response"
              value={stats.pendingApps}
              icon={Clock}
            />
            <StatWidget
              title="Offers"
              value={stats.offerApps}
              icon={Check}
              accent
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-2">
          <Card className="p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm tracking-wide flex items-center">
                <Activity size={16} className="mr-2 opacity-50" /> Recent Activity
              </h3>
              <button
                className="text-[10px] font-bold uppercase opacity-50 hover:opacity-100"
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div key={app.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${app.status === "offer" ? "bg-green-50" : app.status === "rejected" ? "bg-red-500" : "bg-blue-500"}`}
                    ></div>
                    <div>
                      <p className="font-bold text-xs">{app.company}</p>
                      <p className="text-[10px] opacity-50">Applied via {app.source}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono opacity-50">
                    {formatDateDisplay(app.appliedDate)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
