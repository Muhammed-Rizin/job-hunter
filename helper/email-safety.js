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
    // If ENODATA or ENOTFOUND, domain likely has no mail server
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
 * @desc    Generate a randomized subject line to avoid spam filters
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
