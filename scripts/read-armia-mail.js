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
    // Fetch the specific message by UID or SeqNo. Based on previous run, SeqNo was 10367
    const f = imap.seq.fetch("10367", { bodies: "" });
    f.on("message", (msg) => {
      msg.on("body", (stream) => {
        simpleParser(stream, (err, parsed) => {
          console.log(`\n--- MESSAGE START ---`);
          console.log(`Subject: ${parsed.subject}`);
          console.log(`Body: ${parsed.text}`);
          console.log(`--- MESSAGE END ---`);
        });
      });
    });
    f.once("end", () => {
      imap.end();
    });
  });
});

imap.connect();
