import { post } from "@/shared/services/api";

export const sendMail = async ({ to, subject, body, company, role }) => {
  return post("mail/send", { to, subject, body, company, role });
};
