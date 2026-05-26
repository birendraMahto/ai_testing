# Task Plan — Local Test Generator

> Status: 🟡 BLUEPRINT READY — Awaiting user approval before any code is written.

---

## BLUEPRINT

### Project Summary

A **browser-based Test Case Generator** that takes Jira requirements (via text input or file upload) and uses LLMs (local or cloud) to generate functional and non-functional test cases in Jira-compatible tabular format.

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Storage | Browser localStorage (no server DB) |
| File Parsing | pdf-parse, mammoth (.docx), xlsx, multer (uploads) |
| LLM Clients | Ollama SDK, OpenAI SDK (compatible with LMStudio/Grok/Claude/Gemini) |
| Export | json2csv (CSV), exceljs (Excel .xlsx) |
| Styling | CSS (dark/light mode, premium design) |

### Folder Structure

```
Local_Test_Generator/
├── design/                     # Wireframes (existing)
├── task_plan.md                # This file
├── findings.md                 # Research & discoveries
├── progress.md                 # Work log
├── context.md                  # Running context
├── client/                     # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx              # App title + LLM settings button
│   │   │   ├── Sidebar.tsx             # History panel (collapsible)
│   │   │   ├── PromptArea.tsx          # Main text input for requirements
│   │   │   ├── FileUploader.tsx        # Upload .pdf/.docx/.txt/.xlsx/images
│   │   │   ├── TestCaseTable.tsx       # Jira-format tabular output
│   │   │   ├── SettingsModal.tsx       # LLM provider configuration modal
│   │   │   ├── ThemeToggle.tsx         # Dark/Light mode toggle
│   │   │   ├── ExportButtons.tsx       # Copy, Download CSV, Download Excel
│   │   │   └── LoadingSpinner.tsx      # Loading state during generation
│   │   ├── services/
│   │   │   ├── api.ts                  # HTTP calls to backend
│   │   │   └── storage.ts             # localStorage helpers (history, settings)
│   │   ├── types/
│   │   │   └── index.ts               # Shared TypeScript interfaces
│   │   ├── hooks/
│   │   │   ├── useHistory.ts           # History state management
│   │   │   ├── useSettings.ts          # Settings state management
│   │   │   └── useTheme.ts            # Dark/light theme hook
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css                   # Global styles, design tokens
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Node.js Backend
│   ├── src/
│   │   ├── index.ts                    # Express app entry point
│   │   ├── routes/
│   │   │   ├── generate.ts             # POST /api/generate — test case generation
│   │   │   ├── llm.ts                  # GET /api/llm/detect — auto-detect local LLMs
│   │   │   ├── connection.ts           # POST /api/llm/test — test connection
│   │   │   └── upload.ts              # POST /api/upload — file upload + parsing
│   │   ├── services/
│   │   │   ├── llmService.ts           # Unified LLM interface (local + cloud)
│   │   │   ├── ollamaService.ts        # Ollama API integration
│   │   │   ├── lmstudioService.ts      # LM Studio API integration
│   │   │   ├── openaiService.ts        # OpenAI API integration
│   │   │   ├── claudeService.ts        # Claude/Anthropic API integration
│   │   │   ├── geminiService.ts        # Gemini/Google API integration
│   │   │   ├── grokService.ts          # Grok/xAI API integration
│   │   │   ├── fileParser.ts           # Parse uploaded files (.pdf, .docx, .txt, .xlsx, images)
│   │   │   └── exportService.ts        # Generate CSV and Excel files
│   │   ├── prompts/
│   │   │   └── testCasePrompt.ts       # System prompt template for test case generation
│   │   ├── types/
│   │   │   └── index.ts               # Backend TypeScript interfaces
│   │   └── utils/
│   │       └── detectLLM.ts           # Auto-detect running local LLMs
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

### Data Flow

```
User Input (text / file upload)
        │
        ▼
   React Frontend
   (PromptArea / FileUploader)
        │
        ▼ HTTP POST /api/generate or /api/upload
        │
   Express Backend
        │
        ├─── fileParser.ts (if file uploaded — extract text from pdf/docx/txt/xlsx/image)
        │
        ▼
   llmService.ts (route to selected provider)
        │
        ├── ollamaService.ts  ──→ Ollama API (localhost:11434)
        ├── lmstudioService.ts ──→ LM Studio API (localhost:1234)
        ├── openaiService.ts  ──→ OpenAI API
        ├── claudeService.ts  ──→ Claude API
        ├── geminiService.ts  ──→ Gemini API
        └── grokService.ts    ──→ Grok API
                │
                ▼
        LLM generates test cases (one-shot)
                │
                ▼
        Backend parses LLM response into structured JSON
        (array of test case objects with Jira columns)
                │
                ▼
        Response sent to frontend
                │
                ▼
   TestCaseTable.tsx (renders Jira-format table)
        │
        ├── Copy to clipboard
        ├── Download CSV
        ├── Download Excel (.xlsx)
        └── Save to localStorage (history)
```

### Jira Test Case Output Format

| Column | Description |
|---|---|
| Test Case ID | Auto-generated (TC-001, TC-002...) |
| Test Type | Functional / Non-Functional |
| Category | API / Web Application |
| Summary | Brief description of the test |
| Preconditions | Setup required before test |
| Steps | Step-by-step test execution |
| Test Data | Sample data for the test |
| Expected Result | What should happen |
| Priority | High / Medium / Low |
| Severity | Critical / Major / Minor / Trivial |

### Non-Functional Test Categories

- Performance (load time, response time, throughput)
- Security (SQL injection, XSS, CSRF, auth bypass)
- Usability (accessibility, navigation, UI consistency)
- Compatibility (browser, device, OS)

### Settings Modal — Provider Sections

| Section | Fields |
|---|---|
| **Mode Toggle** | Local LLM ↔ API Key |
| **Ollama** | Host URL, Port (11434), Model dropdown (auto-detect) |
| **LM Studio** | Host URL, Port (1234), Model dropdown (auto-detect) |
| **OpenAI** | API Key, Model selector |
| **Claude** | API Key, Model selector |
| **Gemini** | API Key, Model selector |
| **Grok** | API Key, Model selector |
| **Actions** | Save, Test Connection |

### Key Features

1. **Dark/Light Mode** — toggle with persistence in localStorage
2. **History Sidebar** — collapsible, shows past generations, persisted in localStorage
3. **File Upload** — supports .pdf, .docx, .txt, .xlsx, images
4. **Auto-detect Local LLMs** — scans Ollama & LM Studio for running models
5. **One-shot Generation** — full response, no streaming
6. **Tabular Output** — Jira-format table with all standard columns
7. **Export** — Copy to clipboard, CSV download, Excel download
8. **Test Connection** — validate LLM provider before use
9. **No Auth** — open access, personal/team tool
10. **No Server DB** — all persistence via browser localStorage

---

## Phases

### Phase 0: Discovery & Blueprint ✅
- [x] Answer all discovery questions
- [x] Finalize requirements and constraints
- [x] Create blueprint (this document)
- [ ] **USER APPROVAL REQUIRED** ← ⏸️ We are here

### Phase 1: Project Setup
- [ ] Initialize React + Vite frontend (client/)
- [ ] Initialize Node.js + Express backend (server/)
- [ ] Configure TypeScript for both
- [ ] Install all dependencies
- [ ] Set up folder structure
- [ ] Create shared type definitions

### Phase 2: Backend — Core
- [ ] Express server setup with CORS, body-parser
- [ ] File upload route (multer + file parsers)
- [ ] File parser service (pdf, docx, txt, xlsx, image)
- [ ] LLM auto-detect endpoint (Ollama + LM Studio)
- [ ] Test connection endpoint
- [ ] Unified LLM service (provider routing)
- [ ] Individual LLM provider services (6 providers)
- [ ] Test case generation prompt engineering
- [ ] Test case generation endpoint
- [ ] CSV and Excel export endpoints

### Phase 3: Frontend — Core
- [ ] App layout (Header, Sidebar, Main area)
- [ ] Dark/Light theme system
- [ ] Prompt area component
- [ ] File uploader component
- [ ] Settings modal (all providers, toggle, save, test)
- [ ] Test case table component (Jira format)
- [ ] Export buttons (copy, CSV, Excel)
- [ ] History sidebar with localStorage persistence
- [ ] Loading states

### Phase 4: Integration & Polish
- [ ] Connect frontend to all backend APIs
- [ ] End-to-end testing (prompt → generation → display → export)
- [ ] Error handling and user feedback
- [ ] Responsive design
- [ ] Premium UI polish (animations, transitions, glassmorphism)

### Phase 5: Testing & Validation
- [ ] Test with Ollama locally
- [ ] Test with LM Studio locally
- [ ] Test file upload (all formats)
- [ ] Test export (CSV, Excel)
- [ ] Test history persistence
- [ ] Test dark/light mode
- [ ] Cross-browser check

---

> ⚠️ **AWAITING APPROVAL**: Please review this blueprint and confirm to proceed. No code will be written until you approve.
