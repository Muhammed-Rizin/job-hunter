import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { colors } from "../../utils/theme";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "../../utils/animations";
import LabeledInput from "../../components/common/LabeledInput";
import GmailPreview from "../../components/mail/GmailPreview";
import { compileTemplate, compileTemplateWithFallback, getMissingVariables } from "./utils";
import { useMailWizard } from "./MailWizardContext";
import MailBackButton from "./BackButton";
import MailPage from "./MailPage";
import { post } from "../../services/api";
import Card from "../../components/common/Card";

const MailTemplateFill = () => {
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
  const fixedKeys = ["To", "Company", "Role"];
  const variableKeys = Object.keys(templateVars || {}).filter((key) => !fixedKeys.includes(key));

  const handleSendTemplate = async () => {
    if (missingVars.length > 0) {
      toast.error(`Please fill: ${missingVars.join(", ")}`);
      return;
    }
    if (sending) return;

    try {
      setSending(true);
      await post("mail/send", {
        to: templateVars.To,
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
    <MailPage className="h-full pb-20">
      <MailBackButton to="/mail/templates" />

      <motion.div variants={containerVariants} className="flex flex-col md:flex-row gap-8 h-full">
        <motion.div variants={itemVariants} className="w-full md:w-1/2 flex flex-col space-y-6">
          <Card className={`p-6 rounded-3xl border ${colors.card}`} hover={false}>
            <div className="space-y-4">
              <LabeledInput
                label="Recipient Email"
                value={templateVars.To || ""}
                onChange={(e) => setTemplateVars({ ...templateVars, To: e.target.value })}
                inputClassName={colors.input}
              />
              <LabeledInput
                label="Company"
                value={templateVars.Company || ""}
                onChange={(e) => setTemplateVars({ ...templateVars, Company: e.target.value })}
                inputClassName={colors.input}
              />
              <LabeledInput
                label="Role"
                value={templateVars.Role || ""}
                onChange={(e) => setTemplateVars({ ...templateVars, Role: e.target.value })}
                inputClassName={colors.input}
              />

              {variableKeys.length === 0 ? (
                <p className="opacity-50 text-xs italic">No variables in this template.</p>
              ) : (
                variableKeys.map((key) => (
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
          </Card>
          <button
            onClick={() => navigate(`/mail/templates/${template.id}/preview`)}
            className={`md:hidden w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg ${colors.primary}`}
          >
            Preview
          </button>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="hidden md:block w-full md:w-1/2 min-h-105 lg:min-h-150"
        >
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

export default MailTemplateFill;
