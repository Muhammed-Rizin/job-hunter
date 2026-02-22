# Job Hunter Server 🚀

Backend server for the Job Hunter application, designed to manage job applications, user profiles, and automated mail dispatch.

## 🛠️ Tech Stack

- **Node.js & Express**: Core framework.
- **MongoDB & Mongoose**: Database and modeling.
- **Nodemailer**: For sending professional application emails.
- **Firebase Admin**: (Optional) For specialized services.

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=4000
DATABASE_URL=your_mongodb_url
MAIL_USER=your_email
MAIL_PASS=your_app_password
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🤖 Agent Features

The server includes specialized logic for AI Agent integration.

### Manual Application Script
A standalone script is provided for agents to send applications with custom content and automatic resume attachment.

**Command:**
```bash
node scripts/agent-apply.js --json '{"to": "hr@company.com", "company": "Company", "role": "Role", "subject": "Subject", "body": "Body text"}'
```

## 📂 Project Structure

- `controller/`: Request handlers and business logic.
- `model/`: Mongoose schemas.
- `routes/`: API endpoint definitions.
- `services/`: Specialized services (e.g., Mail service).
- `scripts/`: Standalone scripts for automation and agent tasks.
- `utils/`: Common helpers and converters (e.g., Markdown-to-HTML).

## 🔒 Security
- All sensitive files and agent-generated JSON payloads in `scripts/` are excluded from version control via `.gitignore`.
