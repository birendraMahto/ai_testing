// localStorage helpers for history and settings persistence

import type { HistoryEntry, LLMSettings } from '../types';
import { DEFAULT_SETTINGS } from '../types';

const HISTORY_KEY = 'tcg_history';
const SETTINGS_KEY = 'tcg_settings';
const THEME_KEY = 'tcg_theme';

// History
export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryEntry[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function addToHistory(entry: HistoryEntry): HistoryEntry[] {
  const history = getHistory();
  history.unshift(entry);
  // Keep max 100 entries
  if (history.length > 100) history.pop();
  saveHistory(history);
  return history;
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// Settings
export function getSettings(): LLMSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: LLMSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Theme
export function getTheme(): 'dark' | 'light' {
  return (localStorage.getItem(THEME_KEY) as 'dark' | 'light') || 'dark';
}

export function saveTheme(theme: 'dark' | 'light'): void {
  localStorage.setItem(THEME_KEY, theme);
}
