# 🤖 AI Agent Integration Guide - Job Hunter v2.1

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

---

## 📅 Planning to Apply

### 1. Add a Plan
```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-plan.js --add --json '{
  "companyName": "Google",
  "jobLink": "https://google.com/jobs/123",
  "email": "jobs@google.com",
  "package": "AED 12,000/mo",
  "location": "Dubai",
  "visaSupport": true,
  "priority": "High",
  "techStack": "React, Node, MongoDB",
  "details": { "notes": "Found via recruiter" }
}'
```

### 2. Apply from a Plan
When you are ready to apply, use `agent-apply.js` and include the `planId`.

```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-apply.js --json '{
  "planId": "<plan_id_from_db>",
  "to": "jobs@google.com",
  "company": "Google",
  "role": "Software Engineer",
  "subject": "Application...",
  "body": "..."
}'
```

---

## 🔄 Status Sync (Bounces & Delivery)
If you detect a delivery failure (bounce-back) OR if you send a mail externally and need to sync the status.

**Sync Bounce:**
```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-status-sync.js --bounced --email "hr-contact@company.com"
```

**Sync Manual Send (Mark Plan as Applied):**
```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-status-sync.js --sent --id "<plan_id>" --msgid "<message_id>"
```

## 🛠️ Internal Logic
1.  **Resume:** Fetched and attached automatically.
2.  **HTML:** Markdown is converted to professional HTML.
3.  **Database:** Every action is logged for tracking.
