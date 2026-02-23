import "dotenv/config";
import Imap from "imap";
import { simpleParser } from "mailparser";

const imap = new Imap({
  user: process.env.MAIL_USER,
  password: process.env.MAIL_PASS,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false }
});

const failureEmails = [];

imap.once("ready", () => {
  imap.openBox("INBOX", true, (err, box) => {
    if (err) throw err;
    // Search for "Delivery Status Notification (Failure)"
    imap.search([['SUBJECT', 'Delivery Status Notification (Failure)']], (err, results) => {
      if (err || !results.length) {
        console.log(JSON.stringify([]));
        imap.end();
        return;
      }
      
      const f = imap.fetch(results, { bodies: "" });
      f.on("message", (msg) => {
        msg.on("body", (stream) => {
          simpleParser(stream, (err, parsed) => {
            const body = parsed.text || "";
            // Extract the email address that failed
            const match = body.match(/delivered to ([\w.-]+@[\w.-]+\.\w+)/i);
            if (match && match[1]) {
              failureEmails.push(match[1].toLowerCase());
            }
          });
        });
      });
      f.once("end", () => {
        // Unique emails only
        const unique = [...new Set(failureEmails)];
        console.log(JSON.stringify(unique, null, 2));
        imap.end();
      });
    });
  });
});

imap.connect();
