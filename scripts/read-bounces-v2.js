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
    const f = imap.seq.fetch("10377", { bodies: "" });
    f.on("message", (msg) => {
      msg.on("body", (stream) => {
        simpleParser(stream, (err, parsed) => {
          console.log(`\n--- FAILURE NOTIFICATION 10377 ---`);
          console.log(`Body: ${parsed.text}`);
        });
      });
    });
    f.once("end", () => {
      const f2 = imap.seq.fetch("10382", { bodies: "" });
      f2.on("message", (msg) => {
        msg.on("body", (stream) => {
          simpleParser(stream, (err, parsed) => {
            console.log(`\n--- FAILURE NOTIFICATION 10382 ---`);
            console.log(`Body: ${parsed.text}`);
          });
        });
      });
      f2.once("end", () => {
        imap.end();
      });
    });
  });
});

imap.connect();
