import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Use import.meta.url to get the current file's directory robustly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize environment variables first, looking one directory up from config/
dotenv.config({ path: resolve(__dirname, "../.env") });

export const NODE_ENV = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_DEVELOPMENT = NODE_ENV === "development";

export const PORT = process.env.PORT || 4000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const DEFAULT_USER_EMAIL = process.env.DEFAULT_USER_EMAIL;

export const MAIL_USER = process.env.MAIL_USER;
export const MAIL_PASS = process.env.MAIL_PASS;

export const ORIGINS =
  process.env.ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) || [];
export const CLIENT_URL = process.env.CLIENT_URL || ORIGINS?.[0] || "http://localhost:5173";
export const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
export const ALLOWED_ORIGINS = ORIGINS.length ? ORIGINS : [CLIENT_URL];

const isClientLocalhost = CLIENT_URL?.includes("localhost") || CLIENT_URL?.includes("127.0.0.1");
const isServerLocalhost = SERVER_URL?.includes("localhost") || SERVER_URL?.includes("127.0.0.1");
const IS_LOCALHOST = isClientLocalhost && isServerLocalhost;
const COOKIE_SECURE = IS_PRODUCTION && !IS_LOCALHOST;
const COOKIE_SAMESITE = COOKIE_SECURE ? "none" : "lax";

export const ACCESS_TOKEN = {
  SECRET: process.env.ACCESS_TOKEN_SECRET,
  EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
  MAX_AGE: 0.5 * 60 * 60 * 1000, // 30 minutes
};

export const REFRESH_TOKEN = {
  SECRET: process.env.REFRESH_TOKEN_SECRET,
  EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
  MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const COOKIE_OPTIONS = {
  ACCESS: {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
  },
  REFRESH: {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
  },
};

export const GOOGLE_OAUTH = {
  CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || `${SERVER_URL}/auth/google/callback`,
};

export const GITHUB_OAUTH = {
  CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  REDIRECT_URI: process.env.GITHUB_REDIRECT_URI || `${SERVER_URL}/auth/github/callback`,
};
