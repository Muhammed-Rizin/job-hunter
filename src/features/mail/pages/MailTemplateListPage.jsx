import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { containerVariants } from "@/shared/utils/animations";

import { colors } from "@/shared/utils/theme";
import { useMailWizard } from "@/features/mail/context/MailWizardContext";
import MailBackButton from "@/features/mail/components/MailBackButton";
import MailPageLayout from "@/features/mail/components/MailPageLayout";
import Card from "@/shared/components/common/Card";

const MailTemplateList = () => {
  const navigate = useNavigate();
  const {
    templates,
    templatesLoading,
    setActiveTemplateId,
    setTemplateVars,
    buildTemplateVars,
    deleteTemplate,
  } = useMailWizard();

  const handleSelect = (template) => {
    setActiveTemplateId(template.id);
    setTemplateVars(buildTemplateVars(template));
    navigate(`/mail/templates/${template.id}`);
  };

  return (
    <MailPageLayout>
      <div className="flex items-center justify-between mb-6">
        <MailBackButton to="/mail" className="mb-0" />
        <button
          onClick={() => navigate("/mail/templates/new")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
        >
          + New
        </button>
      </div>
      <motion.div variants={containerVariants} className="space-y-3">
        {templatesLoading ? (
          <div className="text-xs opacity-60">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="text-xs opacity-60">No templates yet.</div>
        ) : (
          templates.map((template) => (
            <Card
              key={template.id}
              onClick={() => handleSelect(template)}
              className={`p-4 rounded-xl border hover:border-current transition-all cursor-pointer ${colors.card}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-bold text-sm tracking-wide mb-1 truncate">
                    {template.name}
                  </h4>
                  <p className="text-[10px] opacity-50 truncate">{template.subject}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/mail/templates/${template.id}/edit`);
                    }}
                    className="p-2 rounded-lg border text-gray-500 hover:text-black hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-zinc-300"
                    aria-label="Edit template"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={async (event) => {
                      event.stopPropagation();
                      if (!confirm("Delete this template?")) return;
                      try {
                        await deleteTemplate(template.id);
                        toast.success("Template deleted");
                      } catch (error) {
                        toast.error(error?.message || "Unable to delete template");
                      }
                    }}
                    className="p-2 rounded-lg border text-red-500 hover:bg-red-500/10 border-red-200"
                    aria-label="Delete template"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </motion.div>
    </MailPageLayout>
  );
};

export default MailTemplateList;
