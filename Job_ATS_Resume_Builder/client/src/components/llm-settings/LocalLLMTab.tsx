import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Plug, Save, RotateCcw, Home, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useConnection } from '../../context/ConnectionContext';
import type { ProviderModels, LLMProvider, LLMConnection } from '../../types';

interface LocalLLMTabProps {
  editingConnection?: LLMConnection | null;
  onCancelEdit?: () => void;
}

export function LocalLLMTab({ editingConnection, onCancelEdit }: LocalLLMTabProps) {
  const { refreshConnections, setActiveConnection } = useConnection();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ProviderModels[]>([]);
  const [connectionName, setConnectionName] = useState('');
  const [provider, setProvider] = useState<LLMProvider | ''>('');
  const [modelName, setModelName] = useState('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from editingConnection
  useEffect(() => {
    if (editingConnection) {
      setConnectionName(editingConnection.connectionName);
      setProvider(editingConnection.provider as LLMProvider);
      setModelName(editingConnection.modelName);
    } else {
      handleReset();
    }
  }, [editingConnection]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await api.getProviders();
      // Filter out only local providers for this tab
      const localProviders = data.filter(p => p.provider === 'ollama' || p.provider === 'lmstudio');
      setProviders(localProviders);
    } catch (err) {
      console.error('Failed to load providers:', err);
    }
  };

  // Reset test result when fields change
  useEffect(() => {
    setTestResult(null);
    setSaveEnabled(false);
    setError(null);
  }, [provider, modelName, connectionName]);

  const handleScan = async () => {
    setIsScanning(true);
    try {
      await api.scanLocalConnections();
      await loadProviders();
      alert('Successfully scanned local models!');
    } catch (e: any) {
      alert(`Failed to scan: ${e.message}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleTestConnection = async () => {
    if (!connectionName || !provider || !modelName) {
      setError('Please fill in connection name, provider, and model name');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setError(null);

    try {
      await api.testConnection({ provider, modelName, apiKey: '' });
      setTestResult('success');
      setTestMessage('Connection successful! ✅');
      setSaveEnabled(true);
    } catch (err: any) {
      setTestResult('error');
      setTestMessage(err.message || 'Connection failed');
      setSaveEnabled(false);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    if (!saveEnabled) return;

    setIsSaving(true);
    setError(null);

    try {
      const data = {
        connectionName,
        provider: provider as string,
        modelName,
        apiKey: '',
      };

      let saved;
      if (editingConnection) {
        saved = await api.updateConnection(editingConnection.id, data);
      } else {
        saved = await api.createConnection(data);
      }
      
      // Set as active connection
      setActiveConnection({ ...saved, apiKey: '' });
      await refreshConnections();

      alert(editingConnection ? 'Local connection updated successfully!' : 'Connection saved and set as active!');
      
      if (editingConnection && onCancelEdit) {
        onCancelEdit();
      } else {
        handleReset();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save connection');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConnectionName('');
    setProvider('');
    setModelName('');
    setTestResult(null);
    setSaveEnabled(false);
    setError(null);
  };

  const selectedProviderModels = providers.find((p) => p.provider === provider)?.models || [];

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div className="connection-form__title">
            <Database size={20} style={{ color: 'var(--accent-primary)' }} />
            {editingConnection ? 'Edit Local LLM Configuration' : 'Local LLM Configuration'}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            Configure and use local models (like Ollama or LM Studio) without API keys.
          </p>
        </div>
        <button className="btn btn--secondary" onClick={handleScan} disabled={isScanning}>
          {isScanning ? <span className="btn__spinner" /> : <Database size={16} />}
          {isScanning ? 'Scanning...' : 'Scan Local LLMs'}
        </button>
      </div>

      <div className="connection-form">
        <div className="input-group">
          <label className="input-group__label">Connection Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g., My Local Ollama"
            value={connectionName}
            onChange={(e) => setConnectionName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-group__label">LLM Provider</label>
          <select
            className="select-field"
            value={provider}
            onChange={(e) => {
              const newProvider = e.target.value as LLMProvider;
              setProvider(newProvider);
              
              const availableModels = providers.find(p => p.provider === newProvider)?.models || [];
              if (availableModels.length > 0) {
                setModelName(availableModels[0]);
              } else {
                setModelName('');
              }
            }}
          >
            <option value="">Select a local provider...</option>
            {providers.map((p) => (
              <option key={p.provider} value={p.provider}>
                {p.displayName}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group__label">Model Name</label>
          {selectedProviderModels.length > 0 ? (
            <select
              className="select-field"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            >
              <option value="">Select a model...</option>
              {selectedProviderModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className="input-field"
              placeholder="Enter model name (or scan first)"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
          )}
        </div>

        {/* Test Result */}
        {testResult && (
          <div className={`connection-form__status connection-form__status--${testResult} animate-scaleIn`}>
            {testResult === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {testMessage}
          </div>
        )}

        {error && (
          <div className="connection-form__status connection-form__status--error animate-scaleIn">
            <XCircle size={16} />
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="connection-form__actions" style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn--primary" onClick={handleTestConnection} disabled={isTesting || !provider || !modelName}>
            {isTesting ? <><span className="btn__spinner" /> Testing...</> : <><Plug size={16} /> Test Connection</>}
          </button>
          <button className="btn btn--success" onClick={handleSave} disabled={!saveEnabled || isSaving}>
            {isSaving ? <><span className="btn__spinner" /> Saving...</> : <><Save size={16} /> {editingConnection ? 'Update' : 'Save'}</>}
          </button>
          {editingConnection ? (
            <button className="btn btn--secondary" onClick={onCancelEdit}>
              Cancel
            </button>
          ) : (
            <button className="btn btn--secondary" onClick={handleReset}>
              <RotateCcw size={16} /> Reset
            </button>
          )}
          <button className="btn btn--secondary" onClick={() => navigate('/')}>
            <Home size={16} /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
