export const getTemplateVariables = (template) => {
  if (!template) return [];
  const text = `${template.body || ""} ${template.subject || ""}`;
  return [
    ...new Set(
      [...text.matchAll(/{{(.*?)}}/g)]
        .map((match) => match[1])
        .filter(Boolean),
    ),
  ];
};

export const compileTemplate = (template, vars = {}) => {
  let sub = template?.subject || "";
  let body = template?.body || "";

  Object.keys(vars).forEach((key) => {
    const reg = new RegExp(`{{${key}}}`, "g");
    sub = sub.replace(reg, vars[key]);
    body = body.replace(reg, vars[key]);
  });

  return { sub, body };
};

export const compileTemplateWithFallback = (template, vars = {}) => {
  let sub = template?.subject || "";
  let body = template?.body || "";

  Object.keys(vars).forEach((key) => {
    const reg = new RegExp(`{{${key}}}`, "g");
    const value = vars[key];
    const replacement = value ? value : `{{${key}}}`;
    sub = sub.replace(reg, replacement);
    body = body.replace(reg, replacement);
  });

  return { sub, body };
};

export const getMissingVariables = (vars = {}, requiredKeys = []) => {
  const missing = [];
  requiredKeys.forEach((key) => {
    const value = vars[key];
    if (!value || String(value).trim() === "") missing.push(key);
  });
  return missing;
};
