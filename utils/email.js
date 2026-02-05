const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const markdownToHtml = (value = "") => {
  const safe = escapeHtml(String(value));
  const withBold = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const withLineBreaks = withBold.replace(/\n/g, "<br/>");
  return `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6;">${withLineBreaks}</div>`;
};
