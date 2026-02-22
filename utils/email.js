const escapeHtml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/**
 * Enhanced Markdown to HTML converter for professional emails.
 * Supports: Bold (**), Bullet Points (-, *, •), and Line Breaks.
 */
export const markdownToHtml = (value = "") => {
  if (!value) return "";

  const safe = escapeHtml(String(value));

  // 1. Convert Bold (**text**)
  let html = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // 2. Process line by line for Lists and Paragraphs
  const lines = html.split("\n");
  const processedLines = [];
  let inList = false;

  for (let line of lines) {
    const trimmed = line.trim();
    
    // Check for list starters: "- ", "* ", or "• "
    const isListItem = trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ");

    if (isListItem) {
      if (!inList) {
        processedLines.push('<ul style="margin-top: 8px; margin-bottom: 8px; padding-left: 25px; list-style-type: disc;">');
        inList = true;
      }
      // Remove the prefix and wrap in <li>
      const content = trimmed.replace(/^[-*•]\s+/, "");
      processedLines.push(`<li style="margin-bottom: 4px;">${content}</li>`);
    } else {
      if (inList) {
        processedLines.push("</ul>");
        inList = false;
      }
      
      // Handle empty lines as paragraph breaks, others as line breaks
      if (trimmed === "") {
        processedLines.push('<div style="height: 12px;"></div>');
      } else {
        processedLines.push(`${line}<br/>`);
      }
    }
  }

  // Close list if still open
  if (inList) processedLines.push("</ul>");

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a;">
      ${processedLines.join("\n")}
    </div>
  `.trim();
};
