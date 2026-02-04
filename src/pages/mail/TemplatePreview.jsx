import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import GmailPreview from "../../components/mail/GmailPreview";
import { compileTemplate } from "./utils";
import { useMailWizard } from "./MailWizardContext";
import MailBackButton from "./BackButton";
import MailPage from "./MailPage";

const MailTemplatePreview = () => {
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
    <MailPage className="pb-32">
      <MailBackButton to={`/mail/templates/${template.id}`} />
      <div className="flex flex-col min-h-[60vh] md:min-h-[70vh]">
        <GmailPreview content={content} profile={profile} handleSend={handleSendTemplate} />
      </div>
    </MailPage>
  );
};

export default MailTemplatePreview;
