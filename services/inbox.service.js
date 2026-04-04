import Imap from "imap";
import { simpleParser } from "mailparser";
import models from "../model/index.js";
import { MAIL_USER, MAIL_PASS } from "../config/index.js";

/**
 * @desc    Sync inbox for bounces and HR replies
 */
export const syncInbox = async (user, { type = "all" }) => {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: MAIL_USER,
      password: MAIL_PASS,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    const results = { bounced: [], replies: [] };

    function openInbox(cb) {
      imap.openBox("INBOX", false, cb);
    }

    imap.once("ready", () => {
      openInbox((err, box) => {
        if (err) return reject(err);

        // Search for recent failure notifications (Wide Search)
        // We look for 'Delivery Status Notification' or 'Failure' in the subject
        // And we don't restrict to UNSEEN to ensure we don't miss already clicked ones.
        const searchCriteria = [
          ["OR", ["SUBJECT", "Delivery Status Notification"], ["SUBJECT", "Failure"]],
        ];

        imap.search(searchCriteria, (err, searchResults) => {
          if (err) return reject(err);
          if (!searchResults || searchResults.length === 0) {
            imap.end();
            return resolve(results);
          }

          // Process the last 20 matching messages to avoid timeout
          const targetMessages = searchResults.slice(-20);
          const f = imap.fetch(targetMessages, { bodies: "" });
          f.on("message", (msg, seqno) => {
            msg.on("body", (stream, info) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) return;

                const subject = parsed.subject || "";
                const from = parsed.from?.value[0]?.address || "";
                const body = parsed.text || "";

                if (
                  subject.toLowerCase().includes("delivery status notification") ||
                  from.toLowerCase().includes("mailer-daemon")
                ) {
                  // Attempt to find the failed email in the body
                  const emailMatch = body.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
                  const failedEmail = emailMatch ? emailMatch[0] : null;

                  if (failedEmail) {
                    const normalizedEmail = failedEmail.toLowerCase();
                    // 1. Update Application status
                    const app = await models.Application.findOneAndUpdate(
                      { user: user._id, "mail.to": normalizedEmail, status: { $ne: "bounced" } },
                      { status: "bounced" },
                      { new: true },
                    );

                    // 2. Update related Plan status (Sync)
                    await models.Plan.findOneAndUpdate(
                      { user: user._id, email: normalizedEmail, status: { $ne: "bounced" } },
                      { status: "bounced" },
                    );

                    if (app) results.bounced.push({ company: app.company, email: normalizedEmail });
                  }
                } else {
                  // Potential HR reply
                  results.replies.push({ from, subject });
                }
              });
            });
          });

          f.once("error", (err) => reject(err));
          f.once("end", () => {
            imap.end();
            resolve(results);
          });
        });
      });
    });

    imap.once("error", (err) => reject(err));
    imap.once("end", () => resolve(results));
    imap.connect();
  });
};
