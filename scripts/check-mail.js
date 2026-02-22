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

function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}

imap.once("ready", () => {
  openInbox((err, box) => {
    if (err) throw err;
    const f = imap.seq.fetch(box.messages.total - 10 + ":*", {
      bodies: ""
    });
    f.on("message", (msg, seqno) => {
      msg.on("body", (stream, info) => {
        simpleParser(stream, async (err, parsed) => {
          console.log(`\n📧 [#${seqno}] ${parsed.subject}`);
          console.log(`👤 From: ${parsed.from.text}`);
          console.log(`📅 Date: ${parsed.date}`);
          console.log(`---`);
        });
      });
    });
    f.once("error", (err) => {
      console.log("Fetch error: " + err);
    });
    f.once("end", () => {
      console.log("Done fetching all messages!");
      imap.end();
    });
  });
});

imap.once("error", (err) => {
  console.log(err);
});

imap.once("end", () => {
  console.log("Connection ended");
});

imap.connect();
