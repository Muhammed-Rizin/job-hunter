# 🤖 Job Hunter - MCP Server Specification (v2.0)

This document defines the operational interface for the **Job Hunter MCP Server**. It provides the AI Agent with direct, tool-based access to the project's automation services.

---

## 🏗️ Technical Architecture

The MCP server is built using the official `@modelcontextprotocol/sdk` and acts as a gateway to the project's domain services.

- **Transport**: Stdio (Standard Input/Output).
- **Environment**: Initialized via `bootstrap.js` (Google DNS 8.8.8.8 and absolute `.env` loading).
- **Core Core**: Delegates all logic to `LeadService` and `ApplicationService`.

---

## 🛠️ MCP Toolset

### 1. `search_and_plan_leads`

- **Purpose**: Batch ingest discovered leads into the database.
- **Input**: `leads` (Array of objects including `companyName`, `email`, `priority`, `theHook`, etc.)
- **Logic**: Calls `LeadService.createLead` for each entry.
- **Benefit**: Handles deduplication and normalization automatically.

### 2. `generate_tailored_letter`

- **Purpose**: Create a hyper-personalized cover letter for a specific plan.
- **Input**: `planId` (String), `customHook` (Optional String).
- **Logic**: Calls `ApplicationService.generateLetter`.
- **Output**: Returns the full Markdown body and the local file path where it was archived.

### 3. `send_job_application`

- **Purpose**: Execute the final SMTP dispatch.
- **Input**: `planId` (String), `customBody` (Optional String).
- **Logic**: Calls `ApplicationService.submitApplication`.
- **Security**:
  - Enforces a **5-second throttle** between batch calls.
  - Performs a final **Duplicate Recipient Check** before sending.
  - Attaches the latest resume automatically.

---

## 🌊 AI Agent Strategy (The "MCP Loop")

When operating as an AI agent, you should follow this tool-based loop:

1.  **Research**: Find job leads on LinkedIn/Naukri.
2.  **Ingest**: Call `search_and_plan_leads` with the raw data.
3.  **Tailor**: (Optional) Call `generate_tailored_letter` if you want to preview or customize the letter.
4.  **Execute**: Call `send_job_application` to trigger the actual email.
5.  **Report**: Summarize the performance of the batch to the user.

---

## 🚀 Registration & Deployment

To register the server in your MCP client (e.g., OpenClaw, Claude Desktop), use the following configuration:

```json
"job-hunter": {
  "command": "node",
  "args": ["D:/development/projects/2026/job-hunter/server/mcp-server.js"]
}
```

---

_Last Updated: April 3, 2026_
