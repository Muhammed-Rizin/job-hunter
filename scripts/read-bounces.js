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
    const f = imap.seq.fetch("10376,10377,10382", { bodies: "" });
    f.on("message", (msg) => {
      msg.on("body", (stream) => {
        simpleParser(stream, (err, parsed) => {
          console.log(`\n--- FAILURE NOTIFICATION ---`);
          console.log(`Subject: ${parsed.subject}`);
          console.log(`Body: ${parsed.text}`);
        });
      });
    });
    f.once("end", () => {
      imap.end();
    });
  });
});

imap.connect();
