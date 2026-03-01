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
    // Fetch last 20 messages
    const f = imap.seq.fetch(Math.max(1, box.messages.total - 20) + ":*", { bodies: "" });
    f.on("message", (msg, seqno) => {
      msg.on("body", (stream, info) => {
        simpleParser(stream, (err, parsed) => {
          if (parsed.subject.toLowerCase().includes("failure") || parsed.from.text.includes("mailer-daemon")) return;
          console.log(`\n📧 [#${seqno}] ${parsed.subject}`);
          console.log(`👤 From: ${parsed.from.text}`);
          console.log(`📅 Date: ${parsed.date}`);
          console.log(`---`);
        });
      });
    });
    f.once("end", () => imap.end());
  });
});

imap.connect();
