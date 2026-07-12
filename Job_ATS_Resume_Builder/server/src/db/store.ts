import fs from 'fs';
import path from 'path';
import { LLMConnection, AnalysisResult, BuiltResume } from '../types';

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const CONNECTIONS_FILE = path.join(DATA_DIR, 'connections.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');
const RESUMES_FILE = path.join(DATA_DIR, 'resumes.json');

// Ensure data directory and files exist
function ensureDataFiles(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONNECTIONS_FILE)) {
    fs.writeFileSync(CONNECTIONS_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
  }
  if (!fs.existsSync(RESUMES_FILE)) {
    fs.writeFileSync(RESUMES_FILE, JSON.stringify([], null, 2));
  }
}

ensureDataFiles();

// ===== Generic Read/Write =====
function readJSON<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

function writeJSON<T>(filePath: string, data: T[]): void {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ===== Connections =====
export function getAllConnections(): LLMConnection[] {
  return readJSON<LLMConnection>(CONNECTIONS_FILE);
}

export function getConnectionById(id: string): LLMConnection | undefined {
  const connections = getAllConnections();
  return connections.find((c) => c.id === id);
}

export function getConnectionByName(name: string): LLMConnection | undefined {
  const connections = getAllConnections();
  return connections.find((c) => c.connectionName === name);
}

export function createConnection(connection: LLMConnection): LLMConnection {
  const connections = getAllConnections();
  connections.push(connection);
  writeJSON(CONNECTIONS_FILE, connections);
  return connection;
}

export function updateConnection(id: string, updates: Partial<LLMConnection>): LLMConnection | null {
  const connections = getAllConnections();
  const index = connections.findIndex((c) => c.id === id);
  if (index === -1) return null;

  connections[index] = { ...connections[index], ...updates, updatedAt: new Date().toISOString() };
  writeJSON(CONNECTIONS_FILE, connections);
  return connections[index];
}

export function deleteConnection(id: string): boolean {
  const connections = getAllConnections();
  const filtered = connections.filter((c) => c.id !== id);
  if (filtered.length === connections.length) return false;
  writeJSON(CONNECTIONS_FILE, filtered);
  return true;
}

// ===== History =====
export function getAllHistory(): AnalysisResult[] {
  return readJSON<AnalysisResult>(HISTORY_FILE);
}

export function getHistoryById(id: string): AnalysisResult | undefined {
  const history = getAllHistory();
  return history.find((h) => h.id === id);
}

export function createHistory(result: AnalysisResult): AnalysisResult {
  const history = getAllHistory();
  history.unshift(result); // newest first
  writeJSON(HISTORY_FILE, history);
  return result;
}

export function clearHistory(): void {
  writeJSON(HISTORY_FILE, []);
}

// ===== Built Resumes =====
export function getAllResumes(): BuiltResume[] {
  return readJSON<BuiltResume>(RESUMES_FILE);
}

export function getResumeById(id: string): BuiltResume | undefined {
  const resumes = getAllResumes();
  return resumes.find((r) => r.id === id);
}

export function getResumeByAnalysisId(analysisId: string): BuiltResume | undefined {
  const resumes = getAllResumes();
  return resumes.find((r) => r.analysisId === analysisId);
}

export function createResume(resume: BuiltResume): BuiltResume {
  const resumes = getAllResumes();
  resumes.push(resume);
  writeJSON(RESUMES_FILE, resumes);
  return resume;
}
