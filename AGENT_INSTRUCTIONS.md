# 🤖 AI Agent Integration Guide - Job Hunter v2.5 (Unified CLI)

This system allows AI agents to automatically apply for jobs and manage leads on behalf of Rizin.

## 🚀 Recommended Method: Unified CLI (`agent.js`)
Programmatic agents should use the `node agent.js` command located at the root of the server directory. Use the `--json` flag to avoid shell escaping issues.

### 1. 🚀 Apply for Job
Automatically attaches Rizin's latest Resume PDF. If `planId` is provided, it automatically marks the plan as `applied` and links the email record.
**Command:**
```bash
node agent.js apply --json '{
  "to": "hr@company.com",
  "company": "Company Name",
  "role": "MERN Stack Developer",
  "subject": "Application - Muhammed Rizin",
  "body": "Your custom email content...",
  "planId": "<optional_plan_id>"
}'
```
*Note: You can also use `--plan <planId>` to auto-fill company/email from an existing plan.*

---

## 📅 Lead Generation & Planning

### 2. Add a Lead to Plan
Use this to maintain a list of target companies before sending the mail.
**Command:**
```bash
node agent.js plan --add --json '{
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
node agent.js plan --update "<plan_id>" --json '{
  "status": "applied",
  "priority": "Low"
}'
```

---

## 🔄 Status Sync (Bounces)

### 4. Sync Bounce Status
If a mail bounce-back is detected in the logs.
**Command:**
```bash
node agent.js sync --bounced --email "failed@company.com"
```

---

## 🧹 Maintenance

### 5. Cleanup Duplicates
Scans for applications with the same company and email and keeps only the most recent.
**Command:**
```bash
node agent.js cleanup --duplicates
```

---

## 🏛️ Legacy Utilities
Access specialized internal scripts for batch uploads or legacy processing.
**Command:**
```bash
node agent.js legacy --list
node agent.js legacy --run <script_name.js>
```

## 🛠️ Internal Logic
1.  **Resume:** Fetched and attached automatically from Rizin's profile.
2.  **HTML:** Markdown in `body` is converted to professional HTML.
3.  **Single Entry Point:** All operations go through `agent.js` to ensure consistent database connections and error handling.
