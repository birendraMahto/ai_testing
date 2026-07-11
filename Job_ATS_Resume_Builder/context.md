# Protocol 0: Project Context

## Current Objective
Build and integrate the frontend architecture for the Job ATS Resume Builder to match the provided wireframes and connect it to the functional backend.

## Context Log
- **Phase 1 & 2:** Completed initial backend creation (routes, store, LLM factories).
- **Phase 3 (Frontend Build):** Completed Vite + React frontend mapping exactly to Figma/Wireframe references.
- **Recent Refinements:**
  - Configured provider setups to only expose free/cheapest models (`gpt-4o-mini`, `gemini-2.0-flash`, etc.).
  - Restored full **Ollama** support and retained **LM Studio** support simultaneously.
  - Engineered a **"Scan Local LLMs"** feature, which allows the user to detect and auto-save connections for every local model they have installed on their machine across both Ollama and LM Studio in a single click.
  - Re-started all systems successfully to adopt modifications.

## Next Logical Step
- Test the application using an actual resume PDF and JD, observing the live scoring outputs with either a cloud LLM or a local LM Studio model.
