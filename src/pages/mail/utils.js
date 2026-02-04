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
