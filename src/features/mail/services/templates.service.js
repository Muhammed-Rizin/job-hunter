import { del, get, post, put } from "@/shared/services/api";

const normalizeTemplate = (template) => {
  if (!template) return null;
  const id = template._id || template.id || template.templateId || Date.now();
  return {
    ...template,
    id,
    _id: template._id || id,
  };
};

export const listTemplates = async () => {
  const response = await get("templates");
  const data = response?.data || response?.templates || response;
  return Array.isArray(data) ? data.map(normalizeTemplate) : [];
};

export const createTemplateRecord = async (payload) => {
  const response = await post("templates", payload);
  const data = response?.data || response?.template || response;
  return normalizeTemplate(data);
};

export const updateTemplateRecord = async (payload) => {
  const response = await put("templates", payload);
  const data = response?.data || response?.template || response;
  return normalizeTemplate(data);
};

export const deleteTemplateRecord = async (id) => {
  return del(`templates/${id}`);
};
