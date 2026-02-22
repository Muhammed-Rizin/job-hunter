# 🤖 AI Agent Integration Guide - Job Hunter

This system allows AI agents to automatically apply for jobs on behalf of Rizin.

## 🚀 Recommended Method: JSON Input
Programmatic agents should use the `--json` flag to avoid shell escaping issues with multi-line email bodies.

```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-apply.js --json '{
  "to": "hr@spacex.com",
  "company": "SpaceX",
  "role": "Robotics Engineer",
  "subject": "Application: Rizin - Robotics Engineer",
  "body": "Hello,\n\nI am excited to apply for the **Robotics Engineer** position...",
  "source": "SpaceX Careers",
  "notes": "Automated application via Agent v2"
}'
```

## 📜 Positional Method
Good for simple one-line tests.

```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-apply.js "<email>" "<company>" "<role>" "<subject>" "<body>"
```

## 🛠️ Internal Logic (Automatic)
When an agent calls this script:
1.  **Resume:** The script fetches Rizin's profile, downloads his latest Resume PDF, and attaches it to the email.
2.  **HTML:** Any markdown in the `body` (e.g. `**bold**`) is converted to professional HTML.
3.  **Database:** The application is logged in the `Applications` collection for Rizin to track later.
4.  **Logging:** Success or failure is reported back via `STDOUT` / `STDERR` for the calling agent to process.
