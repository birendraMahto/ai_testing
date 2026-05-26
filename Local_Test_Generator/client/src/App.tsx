import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import type {
  TestCase,
  LLMSettings,
  HistoryEntry,
  DetectedModels,
  ConnectionTestResult,
  LLMProvider,
} from './types';
import { DEFAULT_SETTINGS } from './types';
import {
  generateTestCases,
  detectLocalLLMs,
  testConnection,
  uploadFile,
  exportCSV,
  exportExcel,
} from './services/api';
import {
  getHistory,
  addToHistory,
  clearHistory,
  getSettings,
  saveSettings,
  getTheme,
  saveTheme,
} from './services/storage';
import {
  Menu,
  Settings,
  Sun,
  Moon,
  Send,
  Upload,
  X,
  Copy,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Trash2,
  TestTubes,
  Loader2,
  ClipboardCheck,
  FileText,
  Wifi,
  WifiOff,
} from 'lucide-react';

function App() {
  // State
  const [theme, setTheme] = useState<'dark' | 'light'>(getTheme());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<LLMSettings>(getSettings());
  const [history, setHistory] = useState<HistoryEntry[]>(getHistory());
  const [selectedHistory, setSelectedHistory] = useState<HistoryEntry | null>(null);

  // Prompt state
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Settings state
  const [settingsTab, setSettingsTab] = useState<LLMProvider>(settings.activeProvider);
  const [tempSettings, setTempSettings] = useState<LLMSettings>(settings);
  const [detectedModels, setDetectedModels] = useState<DetectedModels | null>(null);
  const [connectionResult, setConnectionResult] = useState<ConnectionTestResult | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [detectingModels, setDetectingModels] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // Auto-resize textarea
  const adjustTextarea = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, []);

  // Detect local LLMs on settings open
  const handleDetectModels = useCallback(async () => {
    setDetectingModels(true);
    try {
      const result = await detectLocalLLMs(
        tempSettings.ollama.host,
        tempSettings.ollama.port,
        tempSettings.lmstudio.host,
        tempSettings.lmstudio.port
      );
      setDetectedModels(result);
    } catch {
      console.error('Failed to detect local LLMs');
    } finally {
      setDetectingModels(false);
    }
  }, [tempSettings.ollama.host, tempSettings.ollama.port, tempSettings.lmstudio.host, tempSettings.lmstudio.port]);

  // Generate test cases
  const handleGenerate = async () => {
    if (!prompt.trim() && !uploadedFile) return;
    if (!settings.activeProvider || !settings.activeModel) {
      setError('Please configure an LLM provider and model in Settings first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setTestCases([]);
    setSelectedHistory(null);

    try {
      const providerSettings = settings[settings.activeProvider] as any;
      const baseUrl = settings.mode === 'local'
        ? `${providerSettings.host}:${providerSettings.port}`
        : undefined;

      const result = await generateTestCases(
        prompt,
        settings.activeProvider,
        settings.activeModel,
        providerSettings.apiKey,
        baseUrl,
        uploadedFile?.content,
        uploadedFile?.name,
      );

      setTestCases(result.testCases);

      // Save to history
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        fileName: uploadedFile?.name,
        testCases: result.testCases,
        model: result.model,
        provider: result.provider,
        timestamp: result.timestamp,
      };
      const updatedHistory = addToHistory(entry);
      setHistory(updatedHistory);

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to generate test cases.');
    } finally {
      setIsGenerating(false);
    }
  };

  // File upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadFile(file);
      setUploadedFile({ name: result.originalName, content: result.extractedText });
    } catch (err: any) {
      setError(`File upload failed: ${err.message}`);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Export handlers
  const handleCopyAll = async () => {
    const activeCases = selectedHistory ? selectedHistory.testCases : testCases;
    const text = activeCases.map(tc =>
      `${tc.testCaseId}\t${tc.testType}\t${tc.category}\t${tc.summary}\t${tc.preconditions}\t${tc.steps}\t${tc.testData}\t${tc.expectedResult}\t${tc.priority}\t${tc.severity}`
    ).join('\n');
    const header = 'Test Case ID\tTest Type\tCategory\tSummary\tPreconditions\tSteps\tTest Data\tExpected Result\tPriority\tSeverity';
    await navigator.clipboard.writeText(header + '\n' + text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleExportCSV = async () => {
    try {
      const activeCases = selectedHistory ? selectedHistory.testCases : testCases;
      const blob = await exportCSV(activeCases);
      downloadBlob(blob, 'test_cases.csv');
    } catch (err: any) {
      setError(`CSV export failed: ${err.message}`);
    }
  };

  const handleExportExcel = async () => {
    try {
      const activeCases = selectedHistory ? selectedHistory.testCases : testCases;
      const blob = await exportExcel(activeCases);
      downloadBlob(blob, 'test_cases.xlsx');
    } catch (err: any) {
      setError(`Excel export failed: ${err.message}`);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Test connection
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    try {
      const providerConfig = tempSettings[settingsTab] as any;
      const result = await testConnection(
        settingsTab,
        providerConfig.apiKey,
        tempSettings.mode === 'local' ? `${providerConfig.host}:${providerConfig.port}` : undefined,
        providerConfig.port
      );
      setConnectionResult(result);
    } catch (err: any) {
      setConnectionResult({ success: false, message: err.message });
    } finally {
      setTestingConnection(false);
    }
  };

  // Save settings
  const handleSaveSettings = () => {
    // Set active provider and model based on current tab
    const providerConfig = tempSettings[settingsTab] as any;
    const updatedSettings: LLMSettings = {
      ...tempSettings,
      activeProvider: settingsTab,
      activeModel: providerConfig.model || providerConfig.apiKey ? providerConfig.model : '',
    };
    setSettings(updatedSettings);
    saveSettings(updatedSettings);
    setSettingsOpen(false);
    setConnectionResult(null);
  };

  // Settings modal open
  const openSettings = () => {
    setTempSettings(settings);
    setSettingsTab(settings.activeProvider);
    setConnectionResult(null);
    setSettingsOpen(true);
    // Auto-detect local LLMs
    setTimeout(() => handleDetectModels(), 100);
  };

  // Update temp settings helper
  const updateProvider = (provider: LLMProvider, field: string, value: string | number) => {
    setTempSettings(prev => ({
      ...prev,
      [provider]: { ...(prev[provider] as any), [field]: value },
    }));
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  // View history entry
  const handleHistoryClick = (entry: HistoryEntry) => {
    setSelectedHistory(entry);
    setTestCases([]);
    setError(null);
  };

  const activeCases = selectedHistory ? selectedHistory.testCases : testCases;
  const hasResults = activeCases.length > 0;

  const localProviders: LLMProvider[] = ['ollama', 'lmstudio'];
  const apiProviders: LLMProvider[] = ['openai', 'claude', 'gemini', 'grok', 'groq'];
  const visibleProviders = tempSettings.mode === 'local' ? localProviders : apiProviders;

  const providerLabels: Record<LLMProvider, string> = {
    ollama: 'Ollama',
    lmstudio: 'LM Studio',
    openai: 'OpenAI',
    claude: 'Claude',
    gemini: 'Gemini',
    grok: 'Grok',
    groq: 'Groq',
  };

  return (
    <div className="app-container">
      {/* Sidebar — History */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h3>History</h3>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(false)} title="Close sidebar">
            <X size={16} />
          </button>
        </div>
        <div className="sidebar-content">
          {history.length === 0 ? (
            <div className="sidebar-empty">
              <FileText size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
              <p>No history yet.<br />Generate test cases to see them here.</p>
            </div>
          ) : (
            history.map(entry => (
              <div
                key={entry.id}
                className={`history-item ${selectedHistory?.id === entry.id ? 'active' : ''}`}
                onClick={() => handleHistoryClick(entry)}
              >
                <div className="history-item-title">{entry.prompt || entry.fileName || 'Untitled'}</div>
                <div className="history-item-meta">
                  <span>{entry.testCases.length} tests</span>
                  <span>•</span>
                  <span>{entry.provider}/{entry.model}</span>
                  {entry.fileName && (
                    <>
                      <span>•</span>
                      <span>📎 {entry.fileName}</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {history.length > 0 && (
          <button
            className="clear-history-btn"
            onClick={() => { clearHistory(); setHistory([]); setSelectedHistory(null); }}
          >
            <Trash2 size={12} style={{ marginRight: 4 }} />
            Clear History
          </button>
        )}
      </aside>

      {/* Main Area */}
      <main className="main-area">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            {!sidebarOpen && (
              <button className="header-menu-btn" onClick={() => setSidebarOpen(true)} title="Open history">
                <Menu size={20} />
              </button>
            )}
            <h1 className="header-title">Test Case Generator</h1>
          </div>
          <div className="header-right">
            {settings.activeModel && (
              <span className="header-btn active-model" style={{ cursor: 'default' }}>
                {providerLabels[settings.activeProvider]} / {settings.activeModel}
              </span>
            )}
            <button className="theme-toggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} title="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="header-btn" onClick={openSettings} id="settings-btn">
              <Settings size={16} />
              LLM Settings
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <div className="content-scroll">
            {/* Welcome State */}
            {!hasResults && !isGenerating && !error && (
              <div className="welcome-state">
                <div className="welcome-icon">
                  <TestTubes size={40} />
                </div>
                <h2>Test Case Generator</h2>
                <p>
                  Paste your Jira requirements below or upload a requirement document.
                  The AI will generate comprehensive functional and non-functional test cases in Jira format.
                </p>
                {!settings.activeModel && (
                  <div style={{ marginTop: 20 }}>
                    <button className="btn btn-primary" onClick={openSettings}>
                      <Settings size={16} />
                      Configure LLM First
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Loading */}
            {isGenerating && (
              <div className="loading-container">
                <div className="loading-spinner" />
                <div className="loading-text">
                  Generating test cases...
                  <span>Using {providerLabels[settings.activeProvider]} / {settings.activeModel}</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="error-banner">
                <AlertCircle size={18} />
                <div>{error}</div>
              </div>
            )}

            {/* Selected History Info */}
            {selectedHistory && (
              <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Viewing history: "{selectedHistory.prompt?.substring(0, 60) || selectedHistory.fileName}..."
                </span>
                <button
                  className="export-btn"
                  onClick={() => { setSelectedHistory(null); setTestCases([]); }}
                  style={{ padding: '4px 10px' }}
                >
                  <X size={12} /> Close
                </button>
              </div>
            )}

            {/* Test Case Results */}
            {hasResults && (
              <div className="test-results">
                <div className="test-results-header">
                  <div className="test-results-title">
                    <ClipboardCheck size={20} />
                    Generated Test Cases
                    <span className="test-count-badge">{activeCases.length} tests</span>
                  </div>
                  <div className="export-buttons">
                    <button className={`export-btn ${copySuccess ? 'copy-success' : ''}`} onClick={handleCopyAll}>
                      {copySuccess ? <CheckCircle size={14} /> : <Copy size={14} />}
                      {copySuccess ? 'Copied!' : 'Copy All'}
                    </button>
                    <button className="export-btn" onClick={handleExportCSV}>
                      <Download size={14} /> CSV
                    </button>
                    <button className="export-btn" onClick={handleExportExcel}>
                      <FileSpreadsheet size={14} /> Excel
                    </button>
                  </div>
                </div>

                <div className="test-table-container">
                  <table className="test-table">
                    <thead>
                      <tr>
                        <th>Test Case ID</th>
                        <th>Test Type</th>
                        <th>Category</th>
                        <th>Summary</th>
                        <th>Preconditions</th>
                        <th>Steps</th>
                        <th>Test Data</th>
                        <th>Expected Result</th>
                        <th>Priority</th>
                        <th>Severity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCases.map((tc, idx) => (
                        <tr key={idx} className="animate-slide-up" style={{ animationDelay: `${idx * 30}ms` }}>
                          <td><strong>{tc.testCaseId}</strong></td>
                          <td>
                            <span className={`badge ${tc.testType === 'Functional' ? 'badge-functional' : 'badge-non-functional'}`}>
                              {tc.testType}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${tc.category === 'API' ? 'badge-api' : 'badge-web'}`}>
                              {tc.category}
                            </span>
                          </td>
                          <td>{tc.summary}</td>
                          <td>{tc.preconditions}</td>
                          <td style={{ whiteSpace: 'pre-line' }}>{tc.steps}</td>
                          <td>{tc.testData}</td>
                          <td>{tc.expectedResult}</td>
                          <td>
                            <span className={`badge badge-${tc.priority.toLowerCase()}`}>{tc.priority}</span>
                          </td>
                          <td>
                            <span className={`badge badge-${tc.severity.toLowerCase()}`}>{tc.severity}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Area */}
          <div className="prompt-area">
            <div className="prompt-container">
              <div className="prompt-input-wrapper">
                <textarea
                  ref={textareaRef}
                  className="prompt-textarea"
                  placeholder="Paste your Jira requirements here..."
                  value={prompt}
                  onChange={e => { setPrompt(e.target.value); adjustTextarea(); }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  disabled={isGenerating}
                />
                <div className="prompt-actions">
                  <button
                    className="prompt-action-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload requirement document"
                    disabled={isGenerating}
                  >
                    <Upload size={18} />
                  </button>
                  <button
                    className="prompt-send-btn"
                    onClick={handleGenerate}
                    disabled={isGenerating || (!prompt.trim() && !uploadedFile)}
                    title="Generate test cases"
                  >
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              </div>
              {uploadedFile && (
                <div className="file-badge">
                  <FileText size={14} />
                  <span>{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)} title="Remove file">
                    <X size={14} />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.xlsx,.xls,.png,.jpg,.jpeg,.gif,.webp"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSettingsOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>LLM Model Settings</h2>
              <button className="modal-close" onClick={() => setSettingsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {/* Mode toggle */}
              <div className="mode-toggle">
                <button
                  className={`mode-toggle-btn ${tempSettings.mode === 'local' ? 'active' : ''}`}
                  onClick={() => {
                    setTempSettings(p => ({ ...p, mode: 'local' }));
                    setSettingsTab('ollama');
                    setConnectionResult(null);
                  }}
                >
                  🖥️ Local LLM
                </button>
                <button
                  className={`mode-toggle-btn ${tempSettings.mode === 'api' ? 'active' : ''}`}
                  onClick={() => {
                    setTempSettings(p => ({ ...p, mode: 'api' }));
                    setSettingsTab('openai');
                    setConnectionResult(null);
                  }}
                >
                  🌐 API Key
                </button>
              </div>

              {/* Provider tabs */}
              <div className="provider-tabs">
                {visibleProviders.map(p => (
                  <button
                    key={p}
                    className={`provider-tab ${settingsTab === p ? 'active' : ''}`}
                    onClick={() => { setSettingsTab(p); setConnectionResult(null); }}
                  >
                    {providerLabels[p]}
                    {tempSettings.mode === 'local' && detectedModels && (
                      p === 'ollama' && detectedModels.ollama.available ? ' ✓' :
                      p === 'lmstudio' && detectedModels.lmstudio.available ? ' ✓' : ''
                    )}
                  </button>
                ))}
                {tempSettings.mode === 'local' && (
                  <button
                    className="provider-tab"
                    onClick={handleDetectModels}
                    disabled={detectingModels}
                    style={{ marginLeft: 'auto' }}
                  >
                    {detectingModels ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : '🔍'} Detect
                  </button>
                )}
              </div>

              {/* Provider config form */}
              {tempSettings.mode === 'local' ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Host URL</label>
                      <input
                        className="form-input"
                        value={(tempSettings[settingsTab] as any).host || ''}
                        onChange={e => updateProvider(settingsTab, 'host', e.target.value)}
                        placeholder="http://localhost"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Port</label>
                      <input
                        className="form-input"
                        type="number"
                        value={(tempSettings[settingsTab] as any).port || ''}
                        onChange={e => updateProvider(settingsTab, 'port', parseInt(e.target.value) || 0)}
                        placeholder={settingsTab === 'ollama' ? '11434' : '1234'}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model</label>
                    {detectedModels && (
                      (settingsTab === 'ollama' && detectedModels.ollama.models.length > 0) ||
                      (settingsTab === 'lmstudio' && detectedModels.lmstudio.models.length > 0)
                    ) ? (
                      <select
                        className="form-select"
                        value={(tempSettings[settingsTab] as any).model || ''}
                        onChange={e => updateProvider(settingsTab, 'model', e.target.value)}
                      >
                        <option value="">Select a model...</option>
                        {(settingsTab === 'ollama' ? detectedModels.ollama.models : detectedModels.lmstudio.models).map(m => (
                          <option key={m.name} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        className="form-input"
                        value={(tempSettings[settingsTab] as any).model || ''}
                        onChange={e => updateProvider(settingsTab, 'model', e.target.value)}
                        placeholder="e.g., llama3, mistral, codellama"
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">API Key</label>
                    <input
                      className="form-input"
                      type="password"
                      value={(tempSettings[settingsTab] as any).apiKey || ''}
                      onChange={e => updateProvider(settingsTab, 'apiKey', e.target.value)}
                      placeholder={`Enter your ${providerLabels[settingsTab]} API key`}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model</label>
                    <input
                      className="form-input"
                      value={(tempSettings[settingsTab] as any).model || ''}
                      onChange={e => updateProvider(settingsTab, 'model', e.target.value)}
                      placeholder={
                        settingsTab === 'openai' ? 'gpt-4o' :
                        settingsTab === 'claude' ? 'claude-sonnet-4-20250514' :
                        settingsTab === 'gemini' ? 'gemini-2.0-flash' :
                        settingsTab === 'groq' ? 'llama-3.3-70b-versatile' :
                        'grok-3'
                      }
                    />
                  </div>
                </>
              )}

              {/* Connection result */}
              {connectionResult && (
                <div className={`connection-status ${connectionResult.success ? 'success' : 'error'}`}>
                  {connectionResult.success ? <Wifi size={16} /> : <WifiOff size={16} />}
                  {connectionResult.message}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleTestConnection} disabled={testingConnection}>
                {testingConnection ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Wifi size={14} />}
                Test Connection
              </button>
              <button className="btn btn-primary" onClick={handleSaveSettings}>
                <CheckCircle size={14} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
