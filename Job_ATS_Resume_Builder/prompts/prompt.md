# Comprehensive Development Prompt for Job ATS Resume Builder

You are an expert full-stack developer. Your objective is to build the "Job ATS Resume Builder", a full-stack web application that allows users to score their resumes against a job description, receive detailed ATS feedback, and auto-build an optimized resume while maintaining its original layout.

Here is the complete blueprint to build the frontend and backend of this project. Follow these specifications precisely.

## 1. Project Architecture & Tech Stack

**Frontend:**
- **Framework:** React 18 with Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS with CSS Variables for light/dark mode theming (dynamic glassmorphism, premium aesthetic)
- **Icons:** Lucide React
- **Routing:** React Router DOM

**Backend:**
- **Framework:** Node.js with Express
- **Language:** TypeScript
- **Storage:** Local JSON file-based storage (`store.ts`) for saving LLM connections and analysis history. No external database.
- **File Parsing:** `pdf-parse` for PDFs, `mammoth` for DOCX.
- **LLM Integration:** Multi-provider support using `openai`, `@anthropic-ai/sdk`, `@google/genai`. 
- **File Uploads:** `multer` restricted to `.docx` and `.pdf` files.

## 2. Core Features

1. **ATS Resume Analysis:** Users upload a PDF/DOCX and paste a job description. The app cross-references keywords and provides a detailed score out of 10 for: Effectivity, Layout, Content Relevance, Grammar, and Impact.
2. **AI Resume Builder:** After analysis, a single click generates an optimized version of the resume integrating missing keywords and enhancing bullet points.
3. **Cover Letter & Email Generators:** Automatically craft tailored cover letters and follow-up emails based on the analysis.
4. **LLM Connection Management:** Users must configure an LLM before scoring. Support for cloud models (OpenAI, Anthropic, Gemini) and local models (Ollama, LM Studio).
5. **Scan Local LLMs:** A 1-click feature that pings `http://127.0.0.1:11434` (Ollama) and `http://127.0.0.1:1234` (LM Studio) to auto-detect and save all installed local models.

## 3. Backend API Endpoints

Implement the following REST API endpoints:
- `POST /api/connections`: Create a new LLM connection.
- `GET /api/connections`: List all saved connections.
- `GET /api/connections/:id`: Get a specific connection.
- `PUT /api/connections/:id`: Update a saved connection.
- `DELETE /api/connections/:id`: Delete a connection.
- `POST /api/connections/test`: Test an LLM connection by sending a simple prompt.
- `POST /api/connections/scan-local`: Ping local LLM engines and create saved connections automatically.
- `POST /api/analyze`: Multipart form upload (resume file + JD text). Extracts text and calls LLM to analyze.
- `POST /api/build-resume`: Generate improved resume based on analysis.
- `GET /api/history`: Get past analysis history.
- `GET /api/history/:id`: Get specific analysis result.

## 4. Frontend UI & Screens

**Global Design:** Premium dark/light mode UI with smooth transitions and glassmorphism.

**Screen 1: Home Page (Main Landing)**
- **Left Sidebar:** Analysis history list, Theme toggle (Light/Dark), and "LLM Settings" button.
- **Center Panel:** A large textarea for the Job Description, an "Attach Resume" button (file picker), and a "Check Resume Score" button (disabled if no LLM configured).
- **Right Panel:** After scoring, displays ATS analysis (scores, feedback, missing keywords). Features a "Resume Builder" button. After building, it shows the improved resume preview with "Copy Text" and "Download" buttons.

**Screen 2: LLM Settings (New Connection)**
- **Left Sidebar:** "New Connection" (active), "Saved Connection", and a "Scan Local LLMs" button. Back button to home.
- **Center Panel:** Form fields for Connection Name, Provider (Dropdown), Model Name, and API Key. Buttons for "Test Connection" and "Save Connection" (disabled until tested).

**Screen 3: LLM Settings (Saved Connection)**
- **Center Panel:** Dropdown to select a saved connection. Pre-fills Provider, Model, and API Key (all editable except Connection Name). Buttons for "Test Connection" and "Save Connection".

## 5. Development Phases

**Phase 1: Backend Foundation**
- Initialize Express app with TS.
- Set up JSON store mechanism.
- Create all LLM connection routes, including local scanning.
- Implement LLM Provider factory (OpenAI, Claude, Gemini, Local APIs).
- Add file parsing logic (`multer`, `pdf-parse`, `mammoth`).
- Create resume analysis and generation routes.

**Phase 2: Frontend Foundation**
- Initialize React + Vite + TS.
- Setup global Theme and Connection contexts.
- Build UI layout components (Header, Sidebars, Panels) and basic UI elements (Buttons, Dropdowns, Modals).
- Implement light/dark CSS variables.

**Phase 3: Integration & Polish**
- Build Home Page and connect file upload + scoring logic to `/api/analyze`.
- Build LLM Settings pages and wire to `/api/connections`.
- Render the scored results beautifully using `react-markdown`.
- Implement Resume Builder downloading features.
- Polish animations, loading states, and error handling.

Start by setting up the project directory structure and initializing the package managers for both `client/` and `server/`.
