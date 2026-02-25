# 🛸 Job Hunter Unified Agent CLI

One script to rule them all. No more messy JSON files or one-off scripts.

## 🚀 Commands

### 1. Apply (`apply`)
Send a job application.
```bash
# Apply using a specific plan ID (Fetches company/email automatically)
node agent.js apply --plan <plan_id> --json '{"body": "Custom pitch..."}'

# Apply from scratch
node agent.js apply --json '{"to": "hr@google.com", "company": "Google", "body": "Pitch..."}'
```

### 2. Plan (`plan`)
Manage your lead pipeline.
```bash
# Add new lead
node agent.js plan --add --json '{"companyName": "TechCorp", "email": "jobs@tech.com"}'
```

### 3. Sync (`sync`)
Keep data in sync with reality.
```bash
# Mark as bounced
node agent.js sync --bounced --email "failed@company.com"
```

### 4. Cleanup (`cleanup`)
Maintain a pristine database.
```bash
# Deduplicate records
node agent.js cleanup --duplicates
```

---
*Refer to the full `AGENT_INSTRUCTIONS.md` for automation details.*
