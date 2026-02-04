import { useNavigate } from "react-router-dom";

import { colors } from "../../utils/theme";
import CreateTemplateView from "../../components/mail/CreateTemplateView";
import { useMailWizard } from "./MailWizardContext";

const MailTemplateCreate = () => {
  const navigate = useNavigate();
  const { setTemplates } = useMailWizard();

  return (
    <CreateTemplateView
      onSave={(template) => {
        setTemplates((prev) => [...prev, { ...template, id: Date.now() }]);
        navigate("/mail/templates");
      }}
      onCancel={() => navigate(-1)}
      colors={colors}
    />
  );
};

export default MailTemplateCreate;
