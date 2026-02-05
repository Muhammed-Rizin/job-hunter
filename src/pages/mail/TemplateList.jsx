import { useNavigate } from "react-router-dom";

import { colors } from "../../utils/theme";
import { useMailWizard } from "./MailWizardContext";
import MailBackButton from "./BackButton";
import MailPage from "./MailPage";

const MailTemplateList = () => {
  const navigate = useNavigate();
  const { templates, templatesLoading, setActiveTemplateId, setTemplateVars, buildTemplateVars } =
    useMailWizard();

  const handleSelect = (template) => {
    setActiveTemplateId(template.id);
    setTemplateVars(buildTemplateVars(template));
    navigate(`/mail/templates/${template.id}`);
  };

  return (
    <MailPage>
      <div className="flex items-center justify-between mb-6">
        <MailBackButton to="/mail" className="mb-0" />
        <button
          onClick={() => navigate("/mail/templates/new")}
          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
        >
          + New
        </button>
      </div>
      <div className="space-y-3">
        {templatesLoading ? (
          <div className="text-xs opacity-60">Loading templates...</div>
        ) : templates.length === 0 ? (
          <div className="text-xs opacity-60">No templates yet.</div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className={`p-4 rounded-xl border hover:border-current transition-all ${colors.card}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="font-bold text-sm tracking-wide mb-1 truncate">
                    {template.name}
                  </h4>
                  <p className="text-[10px] opacity-50 truncate">{template.subject}</p>
                </div>
                <button
                  onClick={() => handleSelect(template)}
                  className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colors.secondary}`}
                >
                  Use Template
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </MailPage>
  );
};

export default MailTemplateList;
