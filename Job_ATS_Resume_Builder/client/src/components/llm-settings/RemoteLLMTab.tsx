import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plug, Save, RotateCcw, Home, Cloud, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useConnection } from '../../context/ConnectionContext';
import type { ProviderModels, LLMProvider, LLMConnection } from '../../types';

interface RemoteLLMTabProps {
  editingConnection?: LLMConnection | null;
  onCancelEdit?: () => void;
}

export function RemoteLLMTab({ editingConnection, onCancelEdit }: RemoteLLMTabProps) {
  const { refreshConnections, setActiveConnection } = useConnection();
  const navigate = useNavigate();
  
  const [providers, setProviders] = useState<ProviderModels[]>([]);
  const [connectionName, setConnectionName] = useState('');
  const [provider, setProvider] = useState<LLMProvider | ''>('');
  const [modelName, setModelName] = useState('');
  const [apiKey, setApiKey] = useState('');
  
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
      setApiKey(editingConnection.apiKey || '');
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
      // Filter remote providers
      const remoteProviders = data.filter(p => p.provider !== 'ollama' && p.provider !== 'lmstudio');
      setProviders(remoteProviders);
    } catch (err) {
      console.error('Failed to load providers:', err);
    }
  };

  useEffect(() => {
    setTestResult(null);
    setSaveEnabled(false);
    setError(null);
  }, [provider, modelName, apiKey]);

  const handleTestConnection = async () => {
    if (!provider || !modelName || !apiKey) {
      setError('Please fill in provider, model name, and API key');
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    setError(null);

    try {
      await api.testConnection({ provider, modelName, apiKey });
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
    if (!saveEnabled || !connectionName.trim()) {
      setError('Connection Name is required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const data = {
        connectionName: connectionName.trim(),
        provider: provider as string,
        modelName,
        apiKey,
      };

      let saved;
      if (editingConnection) {
        saved = await api.updateConnection(editingConnection.id, data);
      } else {
        saved = await api.createConnection(data);
      }

      setActiveConnection({ ...saved, apiKey });
      await refreshConnections();
      
      alert(editingConnection ? 'Remote connection updated successfully!' : 'Remote connection saved successfully!');
      
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
    setApiKey('');
    setTestResult(null);
    setSaveEnabled(false);
    setError(null);
  };

  const selectedProviderModels = providers.find((p) => p.provider === provider)?.models || [];

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div className="connection-form">
        <div className="connection-form__title">
          <Cloud size={20} style={{ color: 'var(--accent-primary)' }} />
          {editingConnection ? 'Edit Remote Connection' : 'New Remote Connection'}
        </div>
        
        {editingConnection && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            For security, please re-enter your API key to test and save.
          </p>
        )}
        
        <div className="input-group" style={{ marginTop: '1rem' }}>
          <label className="input-group__label">Connection Name</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g., My Claude Account"
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
              if (availableModels.length > 0) setModelName(availableModels[0]);
              else setModelName('');
            }}
          >
            <option value="">Select a provider...</option>
            {providers.map((p) => (
              <option key={p.provider} value={p.provider}>{p.displayName}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-group__label">Model Name</label>
          {selectedProviderModels.length > 0 ? (
            <select className="select-field" value={modelName} onChange={(e) => setModelName(e.target.value)}>
              <option value="">Select a model...</option>
              {selectedProviderModels.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              className="input-field"
              placeholder="Enter model name"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
          )}
        </div>

        <div className="input-group">
          <label className="input-group__label">API Key</label>
          <input
            type="password"
            className="input-field"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>

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

        <div className="connection-form__actions" style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn--primary" onClick={handleTestConnection} disabled={isTesting || !provider || !modelName || !apiKey}>
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
