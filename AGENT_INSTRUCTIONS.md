# AI Agent Integration Guide - Job Hunter (Unified CLI)

This guide defines how an autonomous agent should manage lead planning, approved application sending, and application status lifecycle.

## Core Workflow

1. Agent researches jobs on the internet externally.
2. Agent ingests leads into Planning with all strategic fields.
3. User reviews pending leads.
4. Agent proceeds only after explicit approval (`--proceed`) for batch sending.
5. Sent mails create applications automatically and mark linked plans as applied.
6. Bounce and interview/status updates are synced back into applications (and plans for bounce).

## Command Reference

### 1) Plan Commands

Add one lead:

```bash
node agent.js plan --add --json '{
  "companyName": "Company",
  "jobLink": "https://company.com/jobs/123",
  "email": "hr@company.com",
  "package": "AED 12000/mo",
  "location": "Dubai",
  "priority": "High",
  "techStack": "MERN",
  "theHook": "Strong API architecture",
  "winningMove": "Show production-scale delivery",
  "portalType": "Workday",
  "customPitch": "3-line custom pitch"
}'
```

Bulk ingest leads from web research:

```bash
node agent.js plan --bulk --json '[
  {"companyName":"A","email":"jobs@a.com","priority":"High"},
  {"companyName":"B","email":"careers@b.com","priority":"Medium"}
]'
```

List planning queue:

```bash
node agent.js plan --list --status pending --limit 20
```

Update a plan:

```bash
node agent.js plan --update <plan_id> --json '{"priority":"Low","status":"pending"}'
```

---

### 2) Apply Commands

Send from a specific plan (auto cover-letter fallback):

```bash
node agent.js apply --plan <plan_id>
```

Send with custom content:

```bash
node agent.js apply --plan <plan_id> --json '{
  "subject": "Application - Muhammed Rizin",
  "body": "Custom markdown body",
  "role": "Full Stack Developer"
}'
```

Apply from pending queue with approval gate:

```bash
# preview only (no send)
node agent.js apply --pending --limit 5

# send after approval
node agent.js apply --pending --limit 5 --proceed
```

Notes:
- If `body` is not provided, the agent uses `STANDARD_COVER_LETTER.md`.
- Duplicate recipient protection is strict: same recipient email is blocked forever.
- Resume is auto-attached from profile (`resumeLink` / `resumeName`).

---

### 3) Application Commands

List applications:

```bash
node agent.js application --list --status applied --limit 30
```

Create application manually:

```bash
node agent.js application --create --json '{
  "company":"Company",
  "role":"Frontend Engineer",
  "source":"website",
  "status":"applied",
  "notes":"Manual entry"
}'
```

Update status + statusDetails by application id:

```bash
node agent.js application --update <application_id> --json '{
  "status":"interview",
  "statusDetails":{"round":"Technical 1","mode":"online","date":"2026-03-10","time":"11:00"}
}'
```

Update by recipient email (useful for bounce or bulk updates):

```bash
node agent.js application --update-by-email hr@company.com --json '{"status":"bounced"}'
```

Soft-delete application:

```bash
node agent.js application --delete <application_id>
```

---

### 4) Sync Commands

Mark bounced by email (updates both applications and matching plans):

```bash
node agent.js sync --bounced --email failed@company.com
```

Sync pending plans that already have applications:

```bash
node agent.js sync --plans
```

---

### 5) Cleanup Command

Soft-delete duplicate applications by `company+role+source` key:

```bash
node agent.js cleanup --duplicates
```

---

## Cover Letter Behavior

- Default file: `STANDARD_COVER_LETTER.md`
- Placeholders supported: `{{company}}`, `{{role}}`
- Agent may override with custom markdown body in `--json`.

## Safety and Rules

- Recipient duplicate block is enforced permanently (same user + same recipient email).
- Batch apply requires `--proceed` so user approval is explicit.
- Bounced state can be synced anytime using email-based update commands.
- Application status updates support `statusDetails` for interview workflow fields.
