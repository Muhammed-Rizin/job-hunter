import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth, useGlobal } from "../../context";
import { getTemplateVariables } from "./utils";
import { del, get, post, put } from "../../services/api";

const MailWizardContext = createContext(null);

export const MailWizardProvider = ({ children }) => {
  const { user } = useAuth();
  const { templates, setTemplates, profile, createApplication, fetchApplications } = useGlobal();
  const [activeTemplateId, setActiveTemplateId] = useState(null);
  const [templateVars, setTemplateVars] = useState({});
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);
  const hasLoadedRef = useRef(false);

  const normalizeTemplate = useCallback((template) => {
    if (!template) return null;
    const id = template._id || template.id || template.templateId || Date.now();
    return {
      ...template,
      id,
      _id: template._id || id,
    };
  }, []);

  const loadTemplates = useCallback(async () => {
    if (!user) return;
    try {
      setTemplatesLoading(true);
      const response = await get("templates");
      const data = response?.data || response?.templates || response;
      if (Array.isArray(data)) {
        setTemplates(data.map(normalizeTemplate));
      }
    } catch (error) {
      // ignore template load errors
    } finally {
      setTemplatesLoading(false);
    }
  }, [normalizeTemplate, setTemplates, user]);

  const createTemplate = useCallback(
    async (payload) => {
      try {
        setTemplateSaving(true);
        const response = await post("templates", payload);
        const data = response?.data || response?.template || response;
        const normalized = normalizeTemplate(data);
        if (normalized) {
          setTemplates((prev) => [normalized, ...prev]);
        }
        return normalized;
      } finally {
        setTemplateSaving(false);
      }
    },
    [normalizeTemplate, setTemplates],
  );

  const updateTemplate = useCallback(
    async (payload) => {
      try {
        setTemplateSaving(true);
        const response = await put("templates", payload);
        const data = response?.data || response?.template || response;
        const normalized = normalizeTemplate(data);
        if (normalized) {
          setTemplates((prev) => prev.map((tpl) => (tpl.id === normalized.id ? normalized : tpl)));
        }
        return normalized;
      } finally {
        setTemplateSaving(false);
      }
    },
    [normalizeTemplate, setTemplates],
  );

  const deleteTemplate = useCallback(
    async (id) => {
      if (!id) return;
      await del(`templates/${id}`);
      setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
    },
    [setTemplates],
  );

  useEffect(() => {
    if (!user || hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadTemplates();
  }, [user]);

  const buildTemplateVars = useCallback(
    (template) => {
      const variables = getTemplateVariables(template);
      const profileKeys = Object.keys(profile || {});
      const initialVars = {
        To: "",
        Company: "",
        Role: "",
      };

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
    async (payload) => {
      const appliedDate = payload.appliedDate || new Date().toISOString().split("T")[0];
      return createApplication({ ...payload, appliedDate });
    },
    [createApplication],
  );

  const value = useMemo(
    () => ({
      templates,
      setTemplates,
      templatesLoading,
      templateSaving,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      refreshTemplates: loadTemplates,
      refreshApplications: fetchApplications,
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
      templatesLoading,
      templateSaving,
      createTemplate,
      updateTemplate,
      deleteTemplate,
      loadTemplates,
      fetchApplications,
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
