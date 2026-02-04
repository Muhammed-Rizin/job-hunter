import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { colors } from "../../utils/theme";
import LabeledInput from "../../components/common/LabeledInput";
import GmailPreview from "../../components/mail/GmailPreview";
import { compileTemplate } from "./utils";
import { useMailWizard } from "./MailWizardContext";
import MailBackButton from "./BackButton";
import MailPage from "./MailPage";

const MailTemplateFill = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const {
    templates,
    profile,
    addApplication,
    activeTemplateId,
    setActiveTemplateId,
    templateVars,
    setTemplateVars,
    buildTemplateVars,
  } = useMailWizard();

  const template = useMemo(
    () => templates.find((item) => String(item.id) === String(templateId)),
    [templates, templateId],
  );

  useEffect(() => {
    if (!template) return;
    const hasVars = Object.keys(templateVars).length > 0;
    if (activeTemplateId !== template.id || !hasVars) {
      setActiveTemplateId(template.id);
      setTemplateVars(buildTemplateVars(template));
    }
  }, [
    template,
    activeTemplateId,
    templateVars,
    setActiveTemplateId,
    setTemplateVars,
    buildTemplateVars,
  ]);

  useEffect(() => {
    if (!template) {
      navigate("/mail/templates", { replace: true });
    }
  }, [template, navigate]);

  if (!template) return null;

  const content = compileTemplate(template, templateVars);

  const handleSendTemplate = () => {
    addApplication({
      company: templateVars.Company || "Unknown",
      role: templateVars.Role || "Unknown",
      status: "applied",
      source: "mail",
      notes: `Emailed: ${content.sub}`,
      mailBody: content.body,
    });
    toast.success("Application Sent!");
    navigate("/mail");
  };

  return (
    <MailPage className="h-full pb-20">
      <MailBackButton to="/mail/templates" />

      <div className="flex flex-col md:flex-row gap-8 h-full">
        <div className="w-full md:w-1/2 flex flex-col space-y-6">
          <div className={`p-6 rounded-3xl border ${colors.card}`}>
            <div className="space-y-4">
              {Object.keys(templateVars).length === 0 ? (
                <p className="opacity-50 text-xs italic">No variables in this template.</p>
              ) : (
                Object.keys(templateVars).map((key) => (
                  <LabeledInput
                    key={key}
                    label={key}
                    value={templateVars[key]}
                    onChange={(e) => setTemplateVars({ ...templateVars, [key]: e.target.value })}
                    inputClassName={colors.input}
                  />
                ))
              )}
            </div>
          </div>
          <button
            onClick={() => navigate(`/mail/templates/${template.id}/preview`)}
            className={`md:hidden w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg ${colors.primary}`}
          >
            Preview
          </button>
        </div>
        <div className="hidden md:block w-full md:w-1/2 min-h-[420px] lg:min-h-[600px]">
          <GmailPreview content={content} profile={profile} handleSend={handleSendTemplate} />
        </div>
      </div>
    </MailPage>
  );
};

export default MailTemplateFill;
