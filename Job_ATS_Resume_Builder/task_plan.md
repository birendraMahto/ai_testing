# Task Plan & Blueprint — Job ATS Resume Builder

> Status: 🟢 APPROVED — Execution in progress (Phase 2: Backend Foundation)

---

## 📋 Project Overview

A full-stack web application that allows users to:
1. Score their resume against a Job Description using AI (ATS scoring)
2. Get detailed feedback on what's missing, suggestions for improvement
3. Auto-build/improve their resume to fill gaps identified during scoring
4. Download the improved resume as Word or PDF

**Tech Stack:** React + Vite (frontend) | TypeScript + Node.js/Express (backend)

---

## 🏗️ Architecture Overview

```
Job_ATS_Resume_Builder/
├── design/                          # Wireframes (existing)
├── prompts/                         # AI prompts (existing)
│   └── resume_analysis_prompt.md
├── client/                          # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── LeftSidebar.tsx
│   │   │   │   ├── CenterPanel.tsx
│   │   │   │   └── RightPanel.tsx
│   │   │   ├── home/
│   │   │   │   ├── JDInput.tsx           # Job description textarea
│   │   │   │   ├── ResumeUpload.tsx      # File upload (.docx/.pdf)
│   │   │   │   ├── HistoryList.tsx       # Past analyses
│   │   │   │   ├── ScoreDisplay.tsx      # Score results panel
│   │   │   │   └── ResumeBuilder.tsx     # Improved resume preview + download
│   │   │   ├── llm-settings/
│   │   │   │   ├── NewConnection.tsx     # New connection form
│   │   │   │   ├── SavedConnection.tsx   # Load/edit saved connections
│   │   │   │   └── ConnectionForm.tsx    # Shared form fields
│   │   │   └── common/
│   │   │       ├── ThemeToggle.tsx       # Light/Dark mode toggle
│   │   │       ├── Button.tsx
│   │   │       ├── Dropdown.tsx
│   │   │       └── Modal.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx             # Main 3-panel layout
│   │   │   └── LLMSettingsPage.tsx      # LLM settings page
│   │   ├── context/
│   │   │   ├── ThemeContext.tsx          # Dark/Light mode state
│   │   │   └── ConnectionContext.tsx    # Active LLM connection state
│   │   ├── services/
│   │   │   └── api.ts                   # API calls to backend
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript interfaces
│   │   ├── styles/
│   │   │   ├── index.css                # Global styles + CSS variables
│   │   │   ├── theme.css                # Light/Dark theme tokens
│   │   │   └── components/              # Component-specific CSS
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                          # Node.js/Express backend (TypeScript)
│   ├── src/
│   │   ├── routes/
│   │   │   ├── connections.ts       # CRUD for LLM connections
│   │   │   ├── analyze.ts           # Resume analysis endpoint
│   │   │   ├── build.ts             # Resume builder endpoint
│   │   │   └── history.ts           # Analysis history
│   │   ├── services/
│   │   │   ├── llm/
│   │   │   │   ├── openai.ts        # OpenAI adapter
│   │   │   │   ├── anthropic.ts     # Claude adapter
│   │   │   │   ├── gemini.ts        # Gemini adapter
│   │   │   │   └── factory.ts       # LLM provider factory
│   │   │   ├── parser.ts            # PDF/DOCX text extraction
│   │   │   ├── promptBuilder.ts     # Builds prompt from template + user data
│   │   │   └── resumeGenerator.ts   # Generates improved resume (DOCX/PDF)
│   │   ├── middleware/
│   │   │   ├── upload.ts            # Multer file upload config
│   │   │   └── errorHandler.ts      # Global error handler
│   │   ├── db/
│   │   │   └── store.ts             # JSON file-based storage (connections, history)
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts                 # Express app entry point
│   ├── package.json
│   └── tsconfig.json
├── task_plan.md
├── findings.md
├── progress.md
└── context.md
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/connections` | Create a new LLM connection |
| GET | `/api/connections` | List all saved connections |
| GET | `/api/connections/:id` | Get a specific connection |
| PUT | `/api/connections/:id` | Update a saved connection |
| DELETE | `/api/connections/:id` | Delete a connection |
| POST | `/api/connections/test` | Test an LLM connection (sends a simple prompt) |
| POST | `/api/analyze` | Analyze resume against JD (multipart: resume file + JD text) |
| POST | `/api/build-resume` | Generate improved resume based on analysis |
| GET | `/api/history` | Get analysis history |
| GET | `/api/history/:id` | Get a specific analysis result |

---

## 📄 Data Models

### LLM Connection
```typescript
interface LLMConnection {
  id: string;
  connectionName: string;
  provider: 'openai' | 'anthropic' | 'gemini';
  modelName: string;
  apiKey: string;          // encrypted at rest
  createdAt: string;
  updatedAt: string;
}
```

### Analysis Result
```typescript
interface AnalysisResult {
  id: string;
  connectionId: string;
  jobDescription: string;
  resumeFileName: string;
  scores: {
    overall: number;
    effectivity: number;
    layoutDesign: number;
    contentRelevance: number;
    grammarSyntax: number;
    impact: number;
  };
  feedback: {
    positives: string[];
    improvements: string[];
    missingKeywords: string[];
    suggestions: string[];
  };
  rawResponse: string;      // Full LLM response (markdown)
  createdAt: string;
}
```

### Built Resume
```typescript
interface BuiltResume {
  id: string;
  analysisId: string;
  content: string;          // Markdown/HTML content
  createdAt: string;
}
```

---

## 🔧 LLM Provider Models (Auto-populate dropdown)

| Provider | Models |
|----------|--------|
| OpenAI | gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo |
| Anthropic (Claude) | claude-sonnet-4-20250514, claude-3.5-sonnet, claude-3-haiku |
| Google (Gemini) | gemini-2.0-flash, gemini-1.5-pro, gemini-1.5-flash |

---

## 🎨 UI Screens & Behavior

### Screen 1: Home Page (Main Landing)
- **Header:** "Resume Builder" top banner
- **Left Sidebar:**
  - History list (clickable items to reload past analyses)
  - Theme toggle (Light/Dark)
  - "LLM Settings" button → navigates to LLM Settings page
- **Center Panel:**
  - Large textarea: "Paste the Job description or JD link from LinkedIn"
  - "Attach Resume" button → file picker (.docx, .pdf only)
  - Shows attached filename after upload
  - "Check Resume Score" button → disabled if no active LLM connection, shows tooltip
- **Right Panel:**
  - Initially empty with placeholder message
  - After scoring: Shows detailed ATS analysis with scores, feedback, missing items
  - "Resume Builder" button → triggers resume improvement
  - After building: Shows preview of improved resume
  - "Copy Text" and "Download" (Word/PDF) buttons

### Screen 2: LLM Settings — New Connection
- **Header:** "LLM Settings Builder" top banner
- **Left Sidebar:** "New Connection" button (active), "Saved Connection" button, Back button to home
- **Center Panel:**
  - Title: "New Connection"
  - Form fields: Connection Name, LLM Provider (dropdown), Model Name (dropdown/text), API Key (password field)
  - "Test Connection" button → calls `/api/connections/test`
  - "Save Connection" button → **disabled** until test succeeds, calls `/api/connections`
- **Right Panel:** Empty

### Screen 3: LLM Settings — Saved Connection
- **Left Sidebar:** "Saved Connection" button (active)
- **Center Panel:**
  - Title: "Saved Connection"
  - Connection Name Dropdown → loads saved connection data
  - Provider, Model, API Key fields → pre-filled, **all editable except Connection Name**
  - "Test Connection" + "Save Connection" buttons (same behavior as new)

---

## 🗓️ Phases & Checklist

### Phase 1: Discovery ✅ COMPLETE
- [x] Understand product vision and goals
- [x] Identify core features and user flows
- [x] Clarify tech stack (React + Vite frontend, Node.js/Express/TS backend)
- [x] Review all 3 wireframe designs
- [x] Document all findings

### Phase 2: Backend Foundation
- [ ] Initialize Node.js/Express project with TypeScript
- [ ] Set up project structure (routes, services, middleware, db)
- [ ] Implement JSON file-based storage (connections + history)
- [ ] Create LLM connection CRUD routes
- [ ] Create LLM connection test endpoint
- [ ] Implement LLM provider adapters (OpenAI, Anthropic, Gemini)
- [ ] Implement LLM factory pattern
- [ ] Set up file upload middleware (Multer, .docx/.pdf only)
- [ ] Implement PDF/DOCX text parser service
- [ ] Create resume analysis endpoint (prompt builder + LLM call)
- [ ] Create resume builder endpoint
- [ ] Create history routes
- [ ] Add error handling middleware
- [ ] Test all endpoints

### Phase 3: Frontend Foundation
- [ ] Initialize React project with Vite + TypeScript
- [ ] Set up design system (CSS variables, light/dark theme tokens)
- [ ] Configure React Router (Home, LLM Settings)
- [ ] Create layout components (Header, LeftSidebar, CenterPanel, RightPanel)
- [ ] Create common components (Button, Dropdown, Modal, ThemeToggle)
- [ ] Set up ThemeContext and ConnectionContext

### Phase 4: LLM Settings Pages
- [ ] Build New Connection form page
- [ ] Build Saved Connection form page
- [ ] Implement test connection flow (button states, success/error feedback)
- [ ] Implement save connection flow
- [ ] Wire up to backend API

### Phase 5: Home Page — Resume Scoring
- [ ] Build JD input textarea component
- [ ] Build Resume upload component (.docx/.pdf only)
- [ ] Build "Check Resume Score" button with connection validation
- [ ] Build Score Display panel (right side) with formatted results
- [ ] Build History list in left sidebar
- [ ] Wire up to backend analysis API

### Phase 6: Resume Builder
- [ ] Build "Resume Builder" button in right panel
- [ ] Build resume preview component
- [ ] Implement "Copy Text" functionality
- [ ] Implement "Download" functionality (Word + PDF)
- [ ] Wire up to backend build-resume API

### Phase 7: Polish & Testing
- [ ] Light/Dark mode full testing
- [ ] Responsive layout refinements
- [ ] Error states and loading indicators
- [ ] End-to-end flow testing
- [ ] Final UI polish and micro-animations

---

## 📦 Key Dependencies

### Backend (`server/`)
| Package | Purpose |
|---------|---------|
| express | Web framework |
| cors | Cross-origin requests |
| multer | File upload handling |
| pdf-parse | PDF text extraction |
| mammoth | DOCX text extraction |
| openai | OpenAI API client |
| @anthropic-ai/sdk | Claude API client |
| @google/generative-ai | Gemini API client |
| docx | DOCX file generation |
| uuid | Unique IDs |
| dotenv | Environment variables |
| tsx | TypeScript execution |

### Frontend (`client/`)
| Package | Purpose |
|---------|---------|
| react | UI framework |
| react-dom | React DOM rendering |
| react-router-dom | Client-side routing |
| react-markdown | Render LLM markdown responses |
| file-saver | Client-side file downloads |
| lucide-react | Icons |

---

## ✅ Resolved Decisions (User Answers)

1. **Data storage:** ✅ JSON file-based storage for v1 (no database)
2. **LinkedIn JD link:** ✅ Support paste-only for JD text. Also attempt basic URL content fetching for non-LinkedIn URLs where possible.
3. **API Key security:** ✅ Local JSON file storage for v1. Encryption deferred to production release.
4. **Resume Builder output:** ✅ Generate improved resume and provide download as **PDF** or **Word (.docx)** file. No text/markdown copy — direct file download only.

---

> 🟡 **Blueprint is ready for final approval.**
> Please confirm: ✅ **Approved** to begin Phase 2 (Backend Foundation)?
