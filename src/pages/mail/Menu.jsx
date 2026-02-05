import { Clock, Edit3, Globe, LayoutTemplate, Plus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { colors } from "../../utils/theme";
import { motion } from "framer-motion";
import { containerVariants } from "../../utils/animations";
import MailPage from "./MailPage";
import Card from "../../components/common/Card";

const MailMenu = () => {
  const navigate = useNavigate();

  return (
    <MailPage>
      <div className="md:hidden mb-6">
        <h2 className="text-xl font-bold">Mail Wizard</h2>
      </div>

      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        <Card
          onClick={() => navigate("/mail/templates")}
          className="relative p-6 rounded-3xl cursor-pointer border overflow-hidden group transition-all hover:shadow-lg"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150 rotate-12 text-black dark:text-white">
            <LayoutTemplate size={100} />
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <LayoutTemplate size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Use Template</h3>
            <p className="text-xs opacity-60 mt-1">
              Select from your saved cover letters and auto-fill details.
            </p>
          </div>
        </Card>

        <Card
          onClick={() => navigate("/mail/manual")}
          className="relative p-6 rounded-3xl cursor-pointer border overflow-hidden group transition-all hover:shadow-lg"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150 rotate-12 text-black dark:text-white">
            <Globe size={100} />
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-green-50 text-green-600 dark:bg-green-500/20 dark:text-green-400">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Log Application</h3>
            <p className="text-xs opacity-60 mt-1">
              Record an application submitted via LinkedIn, Indeed, etc.
            </p>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={containerVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card
            onClick={() => navigate("/mail/templates/new")}
            className="p-4 rounded-2xl border text-left hover:border-current transition-colors"
            role="button"
            tabIndex={0}
          >
            <Plus size={20} className="mb-2 opacity-50" />
            <span className="text-xs font-bold block">New Template</span>
          </Card>
          <Card
            className="p-4 rounded-2xl border text-left hover:border-current transition-colors opacity-50 cursor-not-allowed"
            role="button"
            tabIndex={-1}
          >
            <Clock size={20} className="mb-2 opacity-50" />
            <span className="text-xs font-bold block">Scheduled</span>
          </Card>
          <Card
            className="p-4 rounded-2xl border text-left hover:border-current transition-colors opacity-50 cursor-not-allowed"
            role="button"
            tabIndex={-1}
          >
            <Send size={20} className="mb-2 opacity-50" />
            <span className="text-xs font-bold block">Sent Mails</span>
          </Card>
          <Card
            className="p-4 rounded-2xl border text-left hover:border-current transition-colors opacity-50 cursor-not-allowed"
            role="button"
            tabIndex={-1}
          >
            <Edit3 size={20} className="mb-2 opacity-50" />
            <span className="text-xs font-bold block">Drafts</span>
          </Card>
        </div>
      </motion.div>
    </MailPage>
  );
};

export default MailMenu;
