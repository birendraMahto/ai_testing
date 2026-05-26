# Findings — Local Test Generator

> Research, discoveries, and constraints gathered during discovery.

---

## From Design Wireframe (testgenerator_design.jpg)

### Screen 1 — Main Screen
- **Header**: Title "Test Case Generator using Ollama/LmStudio"
- **History panel** (left sidebar) — collapsible, shows past sessions
- **Dark/Light mode** toggle (left side)
- **Central prompt area**: "Ask Here for test case generation" — main text input
- **File uploader** button below the prompt area
- **LLM Model setting** button (top-right corner) — opens Settings screen

### Screen 2 — Settings Screen (LLM Model Setting modal/page)
Configurations visible in design:
1. **Ollama setting** — highlighted/primary (blue)
2. **LmStudio setting** — secondary (grey)
3. **OpenAI API Keys** — secondary (grey)
4. **Save** button — persists the configuration
5. **Test Connection** button — validates connectivity

---

## All Discovery Answers (Final — 2026-05-12)

### Core Purpose
- Generate **API test cases** and **Web application test cases**
- Both **functional** and **non-functional** test cases (all types: Performance, Security, Usability, Compatibility)
- Output in **Jira-compatible format** (tabular)

### Input Methods
- Jira requirements via:
  1. Copy-paste into prompt area
  2. Type directly in chat
  3. Upload requirement documents
- **Supported file formats**: .pdf, .docx, .txt, .xlsx, images/screenshots

### LLM Integration
- **Local LLMs** (auto-detect, list in dropdown):
  - Ollama (default port: 11434)
  - LM Studio (default port: 1234)
- **Cloud API LLMs** (API key required):
  - OpenAI, Claude (Anthropic), Gemini (Google), Grok (xAI)
- **Toggle**: Switch between "Local LLM" and "API Key LLM" modes
- **Model selection**: Always via Settings page (no quick selector on main screen)

### Tech Stack
- **Backend**: Node.js + TypeScript
- **Frontend**: React + TypeScript
- **Ports**: Frontend 3000, Backend 5000

### Jira Test Case Columns (confirmed standard)

| Test Case ID | Test Type | Summary | Preconditions | Steps | Test Data | Expected Result | Priority | Severity |
|---|---|---|---|---|---|---|---|---|

### Output
- **One-shot generation** (no streaming)
- **Copy to clipboard** button
- **Download**: CSV, Excel (.xlsx)
- Functional + non-functional test cases

### History & Storage
- Persist via **browser localStorage** (no server-side DB)
- Each entry stores: prompt, generated tests, files used

### Authentication
- None — personal/team tool

### Prompt Templates
- Not needed — free-text prompt area is sufficient

---

## Configurations (Design + Extended)

| # | Configuration | Type | Details |
|---|---|---|---|
| 1 | Ollama Setting | Local LLM | Host URL, Port (11434), Model dropdown (auto-detect) |
| 2 | LmStudio Setting | Local LLM | Host URL, Port (1234), Model dropdown (auto-detect) |
| 3 | OpenAI API Keys | Cloud API | API Key input |
| 4 | Claude API | Cloud API | API Key input |
| 5 | Gemini API | Cloud API | API Key input |
| 6 | Grok API | Cloud API | API Key input |
| 7 | Local/API Toggle | Setting | Switch between local and cloud LLM mode |
| 8 | Save | Action | Persist all settings |
| 9 | Test Connection | Action | Validate connectivity |

---

## Discovery Status: ✅ COMPLETE — All questions answered.
