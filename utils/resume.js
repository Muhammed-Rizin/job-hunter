import axios from "axios";
import { URL } from "url";

export const MAX_RESUME_BYTES = 3 * 1024 * 1024;

const isPdfContentType = (contentType = "", filename = "") => {
  const normalized = contentType.toLowerCase();
  if (normalized.includes("application/pdf")) return true;
  if (normalized.includes("application/octet-stream") && filename?.toLowerCase().endsWith(".pdf")) {
    return true;
  }
  return false;
};

const getFilenameFromContentDisposition = (contentDisposition = "") => {
  const match = /filename\*?=(?:UTF-8'')?\"?([^\";]+)\"?/i.exec(contentDisposition);
  return match ? decodeURIComponent(match[1]) : "";
};

const getFilenameFromUrl = (link) => {
  try {
    const parsed = new URL(link);
    const pathname = parsed.pathname || "";
    const parts = pathname.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : "";
  } catch (error) {
    return "";
  }
};

const normalizeFilename = (name) => {
  if (!name) return "";
  return name.endsWith(".pdf") ? name : `${name}.pdf`;
};

const normalizeResumeLink = (link) => {
  if (!link) return link;
  try {
    const parsed = new URL(link);
    if (parsed.hostname.includes("drive.google.com")) {
      const fileMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
      const openId = parsed.searchParams.get("id");
      const id = fileMatch?.[1] || openId;
      if (id) {
        return `https://drive.google.com/uc?export=download&id=${id}`;
      }
      if (parsed.pathname.includes("/uc")) {
        parsed.searchParams.set("export", "download");
        return parsed.toString();
      }
    }
    return link;
  } catch (error) {
    return link;
  }
};

const assertValidResumeLink = (link) => {
  if (isNull(link)) return;
  let parsed;
  try {
    parsed = new URL(link);
  } catch (error) {
    throw new Error("Invalid resume link", 400);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Resume link must be http or https", 400);
  }
};

const fetchResume = async (link) => {
  return axios.get(link, {
    responseType: "arraybuffer",
    timeout: 12000,
    maxContentLength: MAX_RESUME_BYTES,
    maxBodyLength: MAX_RESUME_BYTES,
    validateStatus: (status) => status >= 200 && status < 300,
    headers: { "User-Agent": "JobHunter/1.0" },
  });
};

export const validateResumeLink = async (resumeLink, resumeName = "") => {
  if (isNull(resumeLink)) return null;
  assertValidResumeLink(resumeLink);
  const normalizedLink = normalizeResumeLink(resumeLink);

  try {
    const response = await fetchResume(normalizedLink);
    const contentType = response.headers["content-type"] || "";
    const contentLengthHeader = Number(response.headers["content-length"] || 0);
    const size = contentLengthHeader || response.data?.byteLength || 0;

    const filename =
      normalizeFilename(resumeName) ||
      normalizeFilename(
        getFilenameFromContentDisposition(response.headers["content-disposition"]),
      ) ||
      normalizeFilename(getFilenameFromUrl(normalizedLink)) ||
      "Resume.pdf";

    if (size > MAX_RESUME_BYTES) {
      throw new Error("Resume must be less than 3 MB", 400);
    }

    if (!isPdfContentType(contentType, filename)) {
      throw new Error("Resume must be a PDF file", 400);
    }

    return { filename, size, contentType, link: normalizedLink };
  } catch (error) {
    if (error?.message?.includes("maxContentLength")) {
      throw new Error("Resume must be less than 3 MB", 400);
    }
    if (error?.response?.status === 403) {
      throw new Error("Resume link is not publicly accessible", 400);
    }
    if (error?.response?.status === 404) {
      throw new Error("Resume link not found", 404);
    }
    if (error instanceof Error) throw error;
    throw new Error("Unable to fetch resume link", 400);
  }
};

export const fetchResumeBuffer = async (resumeLink, resumeName = "") => {
  if (isNull(resumeLink)) return null;
  assertValidResumeLink(resumeLink);
  const normalizedLink = normalizeResumeLink(resumeLink);
  const response = await fetchResume(normalizedLink);
  const filename =
    normalizeFilename(resumeName) ||
    normalizeFilename(getFilenameFromContentDisposition(response.headers["content-disposition"])) ||
    normalizeFilename(getFilenameFromUrl(normalizedLink)) ||
    "Resume.pdf";

  const contentType = response.headers["content-type"] || "";
  const contentLengthHeader = Number(response.headers["content-length"] || 0);
  const size = contentLengthHeader || response.data?.byteLength || 0;

  if (size > MAX_RESUME_BYTES) {
    throw new Error("Resume must be less than 3 MB", 400);
  }

  if (!isPdfContentType(contentType, filename)) {
    throw new Error("Resume must be a PDF file", 400);
  }

  return {
    buffer: Buffer.from(response.data),
    filename,
    size,
  };
};
