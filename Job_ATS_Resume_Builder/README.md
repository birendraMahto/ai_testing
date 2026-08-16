# Job ATS Resume Builder

An intelligent, full-stack web application that acts as your personal Applicant Tracking System (ATS). It analyzes your resume against a target job description, provides a detailed multi-dimensional score with granular feedback, and uses AI to automatically optimize and rewrite your resume.

## 🚀 Features

- **ATS Resume Analysis:** Upload your resume (PDF/DOCX) and paste a job description. The app cross-references keywords and scores your resume out of 10 across dimensions like Effectivity, Layout, Content Relevance, Grammar, and Impact.
- **AI Resume Builder:** Generate an optimized, tailored version of your resume that integrates missing keywords and enhances bullet points, maximizing your ATS pass rate.
- **Cover Letter & Follow Up Emails:** Automatically craft highly targeted cover letters and professional cold follow-up emails directed at HR.
- **URL Scraping:** Automatically fetch and extract job descriptions from provided LinkedIn or company job URLs.
- **Local & Cloud LLMs:** Use top-tier Cloud APIs (OpenAI, Anthropic, Google Gemini) or run entirely locally and privately using **Ollama** or **LM Studio**.
- **One-Click Local Model Scan:** Automatically detect, ping, and populate all of your locally installed models from Ollama and LM Studio straight into the app with a single click.
- **Premium UI:** A stunning dark-mode/light-mode ready interface built with dynamic glassmorphism and modern aesthetics.

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Vanilla CSS with CSS Variables for comprehensive theme management
- Lucide React (Icons)
- React Router DOM

### Backend
- Node.js & Express
- TypeScript
- `pdf-parse` & `mammoth` (for parsing PDF and DOCX files)
- Multi-provider LLM integrations (`openai`, `@anthropic-ai/sdk`, `@google/genai`)
- Local JSON storage (`store.ts`) for lightweight, database-free connection and history persistence

## 📦 Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- Optional: [Ollama](https://ollama.ai/) or [LM Studio](https://lmstudio.ai/) if you wish to run AI models 100% locally for complete privacy.

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd Job_ATS_Resume_Builder
```

### 2. Backend Setup
Navigate to the `server` directory, install dependencies, and start the development server.
```bash
cd server
npm install
npm run dev
```
*The backend will run on `http://localhost:3001`.*

### 3. Frontend Setup
Open a new terminal window, navigate to the `client` directory, install dependencies, and start the frontend.
```bash
cd client
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## 📖 How to Use

1. **Configure LLM:** Open the web app at `http://localhost:5173`. Click **"LLM Settings"** in the left sidebar.
2. **Add Connection:** 
   - Choose a cloud provider (OpenAI, Gemini, Anthropic) and securely provide your API key.
   - **OR** use the **"Scan Local LLMs"** button. The app will automatically probe ports `11434` (Ollama) and `1234` (LM Studio) to detect your local models and add them instantly. No API keys required.
3. **Analyze:** Navigate back to the Home Page. Paste a Job Description text and attach your Resume file (`.pdf` or `.docx`).
4. **Review & Build:** Review your detailed ATS analysis feedback. Click "Resume Builder" to generate a highly optimized resume tailored to the job description.

## 🔒 Privacy & Local LLMs

For maximum data privacy (ensuring your resume is never sent to the cloud), you can run models on your own hardware:
- **Ollama:** Start the Ollama server (`ollama serve`). The app connects via port `11434`.
- **LM Studio:** Start the local inference server within the LM Studio application. The app connects via port `1234`.

## 📄 License

MIT License. Feel free to use and modify.
