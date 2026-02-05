import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import GmailPreview from "../../components/mail/GmailPreview";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../utils/animations";
import { compileTemplateWithFallback, getMissingVariables } from "./utils";
import { useMailWizard } from "./MailWizardContext";
import MailBackButton from "./BackButton";
import MailPage from "./MailPage";
import { post } from "../../services/api";

const MailTemplatePreview = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const {
    templates,
    profile,
    refreshApplications,
    activeTemplateId,
    setActiveTemplateId,
    templateVars,
    setTemplateVars,
    buildTemplateVars,
  } = useMailWizard();
  const [sending, setSending] = useState(false);

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

  const content = compileTemplateWithFallback(template, templateVars);
  const requiredKeys = ["To", "Company", "Role", ...Object.keys(templateVars || {})];
  const missingVars = getMissingVariables(templateVars, [...new Set(requiredKeys)]);

  const handleSendTemplate = async () => {
    if (missingVars.length > 0) {
      toast.error(`Please fill: ${missingVars.join(", ")}`);
      return;
    }
    if (sending) return;

    try {
      setSending(true);
      await post("mail/send", {
        to: recipient,
        subject: content.sub,
        body: content.body,
        company: templateVars.Company,
        role: templateVars.Role,
      });

      await refreshApplications?.();
      toast.success("Application Sent!");
      navigate("/mail");
    } catch (error) {
      toast.error(error?.message || "Unable to send mail");
    } finally {
      setSending(false);
    }
  };

  return (
    <MailPage className="pb-32">
      <MailBackButton to={`/mail/templates/${template.id}`} />
      <motion.div variants={containerVariants} className="flex flex-col min-h-[60vh] md:min-h-[70vh]">
        <motion.div variants={itemVariants}>
          <GmailPreview
            content={content}
            profile={profile}
            handleSend={handleSendTemplate}
            sending={sending}
            recipient={templateVars.To}
            missingVars={missingVars}
          />
        </motion.div>
      </motion.div>
    </MailPage>
  );
};

export default MailTemplatePreview;
