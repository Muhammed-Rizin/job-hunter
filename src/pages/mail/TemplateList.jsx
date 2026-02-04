import { useNavigate } from "react-router-dom";

import { colors } from "../../utils/theme";
import { useMailWizard } from "./MailWizardContext";
import MailBackButton from "./BackButton";
import MailPage from "./MailPage";

const MailTemplateList = () => {
  const navigate = useNavigate();
  const { templates, setActiveTemplateId, setTemplateVars, buildTemplateVars } = useMailWizard();

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
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleSelect(template)}
            className={`p-4 rounded-xl cursor-pointer border hover:border-current transition-all ${colors.card}`}
          >
            <h4 className="font-bold text-sm tracking-wide mb-1">{template.name}</h4>
            <p className="text-[10px] opacity-50 truncate">{template.subject}</p>
          </div>
        ))}
      </div>
    </MailPage>
  );
};

export default MailTemplateList;
