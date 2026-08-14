# TestingBuddy.AI

TestingBuddy.AI is your intelligent test management companion that helps QA and development teams plan, design, execute, and track testing with the power of AI.

## Features
- **AI-Powered Test Strategy**: Generate intelligent test strategies tailored to your project and risks.
- **Smart Test Planning**: Create comprehensive test plans in minutes with AI assistance.
- **Defect Intelligence**: Auto-categorize, prioritize & analyze defects to find issues faster.
- **Test Case Generation**: Generate, organize & reuse test cases with intelligent recommendations.
- **Release Confidence**: Generate release notes instantly and communicate changes with clarity.
- **Jira Integration**: Native integration with Jira to fetch real-time ticket details.
- **Local & Remote LLMs**: Support for Ollama local models and remote API LLMs.

## Technology Stack
- **Frontend**: React, Vite, TypeScript, Lucide React
- **Backend**: Node.js, Express, Jira API, Ollama REST API

## Getting Started

### Prerequisites
- Node.js (v16+)
- Ollama (installed locally if using local models)
- A Test Management Tool (Jira) account and API Token

### Setup Instructions

1. **Backend Setup**
   ```bash
   cd api
   npm install
   # Start the server (runs on port 3000)
   node server.js
   ```

2. **Frontend Setup**
   ```bash
   cd web
   npm install
   # Start the dev server (runs on port 5174)
   npm run dev
   ```

3. **Configure Settings**
   - Open the web interface.
   - Navigate to **Settings**.
   - Under **Test Management Tool**, add your Jira URL, Email, and API Token. Test and Save.
   - Under **LLM Connection**, scan for Local LLMs (Ollama) or configure a Remote LLM. Test and Save.

4. **Generate Documents**
   - Once both Tool Status and LLM Status are green, navigate to any page (e.g., Test Strategy).
   - Enter a Jira Ticket ID and fetch the details.
   - Select your generation options and click **Generate**.
   - Preview or Download your fully AI-generated markdown document!
