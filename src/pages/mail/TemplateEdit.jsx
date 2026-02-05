import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { colors } from "../../utils/theme";
import CreateTemplateView from "../../components/mail/CreateTemplateView";
import { useMailWizard } from "./MailWizardContext";

const MailTemplateEdit = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const { templates, updateTemplate, templateSaving } = useMailWizard();

  const template = useMemo(
    () => templates.find((item) => String(item.id) === String(templateId)),
    [templates, templateId],
  );

  if (!template) {
    return null;
  }

  return (
    <CreateTemplateView
      initialTemplate={template}
      submitLabel="Update Template"
      isSaving={templateSaving}
      onSave={async (payload) => {
        try {
          await updateTemplate({ id: template.id, ...payload });
          toast.success("Template updated");
          navigate("/mail/templates");
        } catch (error) {
          toast.error(error?.message || "Unable to update template");
        }
      }}
      onCancel={() => navigate(-1)}
      colors={colors}
    />
  );
};

export default MailTemplateEdit;
