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

imap.once("ready", () => {
  imap.openBox("INBOX", true, (err, box) => {
    if (err) throw err;
    const f = imap.seq.fetch("10390:10396", { bodies: "" });
    f.on("message", (msg) => {
      msg.on("body", (stream) => {
        simpleParser(stream, (err, parsed) => {
          console.log(`\n--- NOTIFICATION [#${parsed.messageId}] ---`);
          console.log(`Subject: ${parsed.subject}`);
          console.log(`Body Snippet: ${parsed.text?.substring(0, 300)}`);
        });
      });
    });
    f.once("end", () => {
      imap.end();
    });
  });
});

imap.connect();
