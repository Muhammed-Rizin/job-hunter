import dns from "node:dns/promises";

/**
 * @desc    Verify if an email domain has valid MX records
 */
export const verifyDomain = async (email) => {
  const domain = email.split("@")[1];
  if (!domain) return false;

  try {
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * @desc    Check for blacklisted or high-risk email prefixes
 */
export const isHighRiskEmail = (email) => {
  const riskyPrefixes = ["noreply", "no-reply", "webmaster", "support", "sales", "admin"];
  const prefix = email.split("@")[0].toLowerCase();
  return riskyPrefixes.some((p) => prefix.includes(p));
};

/**
 * @desc    Generate a randomized subject line for emails
 */
export const getRandomSubject = (company, role) => {
  const templates = [
    `Application for ${role} role - Muhammed Rizin`,
    `Interested in the ${role} position at ${company}`,
    `${role} Application: Muhammed Rizin`,
    `Muhammed Rizin - ${role} at ${company}`,
    `Inquiry regarding ${role} vacancy at ${company}`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

const escapeHtml = (value = "") =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * Enhanced Markdown to HTML converter for professional emails.
 */
export const markdownToHtml = (value = "") => {
  if (!value) return "";

  const safe = escapeHtml(value);
  let html = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const lines = html.split("\n");
  const processedLines = [];
  let inList = false;

  for (let line of lines) {
    const trimmed = line.trim();
    const isListItem =
      trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ");

    if (isListItem) {
      if (!inList) {
        processedLines.push(
          '<ul style="margin-top: 8px; margin-bottom: 8px; padding-left: 25px; list-style-type: disc;">',
        );
        inList = true;
      }
      const content = trimmed.replace(/^[-*•]\s+/, "");
      processedLines.push(`<li style="margin-bottom: 4px;">${content}</li>`);
    } else {
      if (inList) {
        processedLines.push("</ul>");
        inList = false;
      }
      if (trimmed === "") {
        processedLines.push('<div style="height: 12px;"></div>');
      } else {
        processedLines.push(`${line}<br/>`);
      }
    }
  }

  if (inList) processedLines.push("</ul>");

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a;">
      ${processedLines.join("\n")}
    </div>
  `.trim();
};
