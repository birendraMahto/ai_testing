# TestingBuddy.ai - Project Constitution

## 1. Identity & Goals
TestingBuddy.ai is an intelligent testing assistant integrating with Test Management Tools and Local/Remote LLMs to automate Test Strategy, Test Planning, Test Cases, Defect Reports, and Release Notes.

## 2. Data Schema

### 2.1 Connection States
- `ToolConnection`: `{ toolName: string, url: string, email: string, token: string, lastTested: Date | null, status: 'success' | 'failed' | 'pending' }`
- `LLMConnection`: `{ connectionName: string, type: 'local' | 'remote', llmName: string, modelName: string, token?: string, lastTested: Date | null, status: 'success' | 'failed' | 'pending' }`

### 2.2 Global State
- `toolStatus`: boolean (True if at least one ToolConnection is success)
- `llmStatus`: boolean (True if at least one LLMConnection is success)

## 3. Architecture Rules
- Follow a 3-Layer architecture (SOPs in `architecture/`, Deterministic Logic in `tools/`, Intermediates in `.tmp/`).
- Web layer acts as the Stylize & Navigation layer for users.
- Gating Rule: 5 core features are disabled unless `toolStatus && llmStatus` is true.
