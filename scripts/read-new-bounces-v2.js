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
    [10383, 10384, 10385].forEach(seq => {
       const f = imap.seq.fetch(seq.toString(), { bodies: "" });
       f.on("message", (msg) => {
          msg.on("body", (stream) => {
            simpleParser(stream, (err, parsed) => {
              console.log(`\n--- FAILURE NOTIFICATION ${seq} ---`);
              console.log(`Body: ${parsed.text}`);
            });
          });
       });
    });
    // Give it some time to finish
    setTimeout(() => imap.end(), 10000);
  });
});

imap.connect();
