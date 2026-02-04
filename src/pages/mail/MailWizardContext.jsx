import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useGlobal } from "../../context";
import { getTemplateVariables } from "./utils";

const MailWizardContext = createContext(null);

export const MailWizardProvider = ({ children }) => {
  const { templates, setTemplates, profile, setApplications } = useGlobal();
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [templateVars, setTemplateVars] = useState({});

  const buildTemplateVars = useCallback(
    (template) => {
      const variables = getTemplateVariables(template);
      const profileKeys = Object.keys(profile || {});
      const initialVars = {};

      variables.forEach((variable) => {
        const profileKey = profileKeys.find(
          (key) => key.toLowerCase() === variable.toLowerCase().replace(/\s/g, ""),
        );
        initialVars[variable] = profileKey ? profile[profileKey] : "";
      });

      return initialVars;
    },
    [profile],
  );

  const addApplication = useCallback(
    (payload) => {
      const appliedDate = payload.appliedDate || new Date().toISOString().split("T")[0];
      const next = { ...payload, id: payload.id || Date.now(), appliedDate };
      setApplications((prev) => [next, ...prev]);
    },
    [setApplications],
  );

  const value = useMemo(
    () => ({
      templates,
      setTemplates,
      profile,
      addApplication,
      activeTemplateId,
      setActiveTemplateId,
      templateVars,
      setTemplateVars,
      buildTemplateVars,
    }),
    [
      templates,
      setTemplates,
      profile,
      addApplication,
      activeTemplateId,
      templateVars,
      buildTemplateVars,
    ],
  );

  return <MailWizardContext.Provider value={value}>{children}</MailWizardContext.Provider>;
};

export const useMailWizard = () => {
  const context = useContext(MailWizardContext);
  if (!context) throw new Error("useMailWizard must be used within MailWizardProvider");
  return context;
};
