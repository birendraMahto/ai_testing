# Job ATS Resume Builder

An intelligent web application that analyzes your resume against a job description, provides an ATS score with detailed feedback, and uses AI to automatically optimize your resume while preserving its original structure and layout.

## Features

- **ATS Resume Analysis:** Upload your resume (PDF/DOCX) and paste a job description. The app acts as an Applicant Tracking System (ATS), cross-referencing keywords and providing a detailed score out of 10.
- **AI Resume Builder:** After the analysis, with a single click, generate an optimized version of your resume that integrates missing keywords and enhances bullet points, all while **strictly maintaining the original layout and format**.
- **Local & Cloud LLMs:** Power the analysis using top-tier Cloud APIs (OpenAI, Anthropic, Google Gemini) or run entirely locally and privately using **Ollama** or **LM Studio**.
- **One-Click Local Model Scan:** Automatically detect and populate all of your locally installed models from Ollama and LM Studio straight into the app.
- **Premium UI:** Built with a stunning dark-mode/light-mode ready interface, utilizing dynamic glassmorphism and modern aesthetics.

## Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Vanilla CSS with CSS Variables for theme management
- Lucide React (Icons)

### Backend
- Node.js & Express
- TypeScript
- `pdf-parse` & `mammoth` (for Resume parsing)
- Multi-provider LLM integrations (`openai`, `@anthropic-ai/sdk`, `@google/genai`)
- Local JSON storage (`store.ts`) for connection history and data

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- Optional: [Ollama](https://ollama.ai/) or [LM Studio](https://lmstudio.ai/) if you wish to run AI models locally.

## Setup & Installation

### 1. Clone the repository and navigate to the folder
```bash
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

## How to Use

1. **Configure LLM:** Open the web app at `http://localhost:5173`. Click **"LLM Settings"** in the left sidebar.
2. **Add Connection:** 
   - Choose a cloud provider (OpenAI, Gemini, Anthropic) and provide an API key.
   - **OR** choose **Local (Ollama)** or **Local (LM Studio)**. Use the **"Scan Local LLMs"** button to automatically detect all of your local models. No API key required.
3. **Analyze:** Go to the Home Page. Paste a Job Description and attach your Resume file (`.pdf` or `.docx`).
4. **Build:** Review your detailed ATS analysis feedback, then click "Resume Builder" to generate an optimized resume tailored to that exact job description.

## Local LLM Configuration

If you prefer maximum privacy, you can run the LLMs locally on your own hardware:
- **Ollama:** Start the Ollama server in your terminal (`ollama serve`) or app. The app connects via port `11434`.
- **LM Studio:** Start the local inference server within the LM Studio app. The app connects via port `1234`.

## License

MIT License. Feel free to use and modify.
