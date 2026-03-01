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
    // Search for failure notifications since yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    imap.search([['SUBJECT', 'Delivery Status Notification (Failure)'], ['SINCE', yesterday]], (err, results) => {
      if (err || !results.length) {
        console.log("No new bounce mails found.");
        imap.end();
        return;
      }
      
      const f = imap.fetch(results, { bodies: "" });
      f.on("message", (msg) => {
        msg.on("body", (stream) => {
          simpleParser(stream, (err, parsed) => {
            const body = parsed.text || "";
            const match = body.match(/delivered to ([\w.-]+@[\w.-]+\.\w+)/i);
            if (match && match[1]) {
              failureEmails.push(match[1].toLowerCase());
            }
          });
        });
      });
      f.once("end", () => {
        const unique = [...new Set(failureEmails)];
        console.log("BOUNCED_EMAILS_START");
        console.log(JSON.stringify(unique));
        console.log("BOUNCED_EMAILS_END");
        imap.end();
      });
    });
  });
});

imap.connect();
