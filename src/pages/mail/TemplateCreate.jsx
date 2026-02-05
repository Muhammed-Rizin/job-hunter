import { useNavigate } from "react-router-dom";

import { colors } from "../../utils/theme";
import CreateTemplateView from "../../components/mail/CreateTemplateView";
import { useMailWizard } from "./MailWizardContext";

const MailTemplateCreate = () => {
  const navigate = useNavigate();
  const { createTemplate, templateSaving, refreshTemplates } = useMailWizard();

  return (
    <CreateTemplateView
      isSaving={templateSaving}
      onSave={async (template) => {
        const created = await createTemplate(template);
        if (created) {
          await refreshTemplates();
          navigate("/mail/templates");
        }
      }}
      onCancel={() => navigate(-1)}
      colors={colors}
    />
  );
};

export default MailTemplateCreate;
