# Findings — Job ATS Resume Builder

> Research, discoveries, constraints, and decisions gathered during the project.

---

## Existing Assets (Discovered)

### 1. Resume Analysis Prompt (`prompts/resume_analysis_prompt.md`)
- A pre-written prompt that acts as an ATS scoring system
- Scores a resume against a Job Description on 6 dimensions:
  - Overall Result, Effectivity, Layout & Design, Content Relevance, Grammar & Syntax, Impact
- Each dimension scored out of 10 with feedback
- Uses ✅ for positive aspects and 🙈 for areas of improvement
- Cross-references JD keywords with resume content
- Expects: Resume (.docx/.pdf) + Job Description (text or LinkedIn link)

### 2. Design Wireframes (`design/` folder — 3 screens)

#### Screen 1: `check_score.jpg` — Main Landing Page
- Top bar: "Resume Builder" header (red banner)
- Left sidebar (gray): "History" button (top), "Light/Dark Modes" toggle, "LLM Setting" button (bottom)
- Center panel (blue): Main content area with text input "Paste the Job description or JD link from LinkedIn", "Attach Resume" button, "Check Resume Score" button
- Right panel (gray): "Resume Builder" button

#### Screen 2: `llm_setting.jpg` — LLM Settings / New Connection
- Top bar: "LLM Settings Builder" header (red banner)
- Left sidebar (gray): "New Connection" button, "Saved Connection" button
- Center panel (blue): Form titled "New Connection" with fields:
  - Connection Name
  - LLM Provider Name (OpenAI/Claude/Gemini)
  - Model Name
  - API Key
  - Two action buttons: "Test Connection" and "Save Connection"
- Right panel (gray): Empty

#### Screen 3: `saved_connection.jpg` — Saved Connection View
- Top bar: "LLM Settings Builder" header (red banner)
- Left sidebar (gray): "Saved Connection" button (active)
- Center panel (blue): Form titled "Saved Connection" with fields:
  - Connection Name Dropdown (select from saved connections)
  - LLM Provider Name (OpenAI/Claude/Gemini) — editable
  - Model Name — editable
  - API Key — editable
  - Two action buttons: "Test Connection" and "Save Connection"
- Right panel (gray): Empty

---

## Discovery Findings (From User Requirements)

### Product Type
- Full-stack web application: React (frontend) + TypeScript/Node.js (backend)
- ATS Resume Scorer + Resume Builder combined

### User Flow
1. User sets up LLM connection first (mandatory before scoring)
2. User pastes Job Description text or LinkedIn JD link in center panel
3. User attaches resume (.docx or .pdf only)
4. User clicks "Check Resume Score"
5. Backend uses `resume_analysis_prompt.md` + resume + JD to call LLM API
6. Results displayed in right panel with detailed scores, missing items, suggestions
7. User can click "Resume Builder" to auto-generate improved resume
8. Improved resume shows preview in right panel
9. User can copy text or download as Word/PDF

### LLM Connection Management
- Users must configure LLM before using the app
- Support multiple LLM providers: OpenAI, Claude, Gemini
- Provider dropdown auto-populates model names where possible
- Connection test required before saving
- Save Connection button disabled until test succeeds
- Saved connections can be loaded via dropdown
- All fields editable except Connection Name on saved connections
- Selected connection used for all resume operations

### History Feature
- Past analyses should be stored and displayed in left sidebar
- Storage mechanism: to be determined (likely backend database or localStorage)

---

## Constraints
- File uploads restricted to .docx and .pdf only
- LLM connection must be configured and tested before resume scoring
- API keys must be stored securely (encrypted on backend)
- LinkedIn JD links will need scraping/parsing on the backend

---

## Technical Research

### LLM Provider APIs
- **OpenAI**: `openai` npm package, models: gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo
- **Anthropic (Claude)**: `@anthropic-ai/sdk` npm package, models: claude-sonnet-4-20250514, claude-3.5-sonnet, claude-3-haiku
- **Google (Gemini)**: `@google/generative-ai` npm package, models: gemini-2.0-flash, gemini-1.5-pro, gemini-1.5-flash

### File Parsing
- PDF parsing: `pdf-parse` npm package
- DOCX parsing: `mammoth` npm package (extracts text from .docx)

### File Generation (Resume Builder output)
- PDF generation: `pdfkit` or `puppeteer` for HTML-to-PDF
- DOCX generation: `docx` npm package

### Frontend
- React with Vite (TypeScript)
- React Router for page navigation
- CSS Variables for light/dark mode theming
