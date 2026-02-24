# 🤖 AI Agent Integration Guide - Job Hunter v2.2

This system allows AI agents to automatically apply for jobs and manage leads on behalf of Rizin.

## 🚀 Recommended Method: JSON Input
Programmatic agents should use the `--json` flag to avoid shell escaping issues.

### 1. 🚀 Apply for Job
Automatically attaches Rizin's latest Resume PDF. Use `planId` to sync status.
**Command:**
```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-apply.js --json '{
  "to": "hr@company.com",
  "company": "Company Name",
  "role": "MERN Stack Developer",
  "subject": "Application - Muhammed Rizin",
  "body": "Your custom email content...",
  "planId": "<optional_plan_id>",
  "appliedDate": "YYYY-MM-DD"
}'
```

---

## 📅 Lead Generation & Planning

### 2. Add a Lead to Plan
Use this to maintain a list of target companies before sending the mail.
**Command:**
```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-plan.js --add --json '{
  "companyName": "Google",
  "jobLink": "https://careers.google.com/jobs/123",
  "email": "hr@google.com",
  "package": "AED 15,000/mo",
  "location": "Dubai",
  "priority": "High",
  "techStack": "React, Node, MongoDB",
  "theHook": "Focus on high-fidelity UI/UX",
  "winningMove": "Highlight the ASAP Project"
}'
```

### 3. Update Plan Details
**Command:**
```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-plan.js --update "<plan_id>" --json '{
  "status": "applied",
  "details": { "notes": "Followed up on LinkedIn" }
}'
```

---

## 🔄 Status Sync (Bounces & External)

### 4. Sync Bounce Status
If a mail bounce-back is detected.
**Command:**
```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-status-sync.js --bounced --email "hr-contact@company.com"
```

### 5. Sync External Send
If you send a mail via an external tool and need to update the plan.
**Command:**
```bash
node D:\development\projects\2026\job-hunter\server\scripts\agent-status-sync.js --sent --id "<plan_id>" --msgid "<external_message_id>"
```

## 🛠️ Internal Logic
1.  **Resume:** Fetched and attached automatically by `agent-apply.js`.
2.  **HTML:** Markdown in `body` is converted to professional HTML.
3.  **Metrics:** Every script instantly logs to the centralized Stats API.
