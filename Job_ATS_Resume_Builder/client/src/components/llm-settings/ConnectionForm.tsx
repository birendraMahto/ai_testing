import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Plug, Save, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useConnection } from '../../context/ConnectionContext';
import type { ProviderModels, LLMProvider } from '../../types';

interface ConnectionFormProps {
  mode: 'new' | 'edit';
  connectionId?: string;
  connectionName?: string;
  initialProvider?: LLMProvider;
  initialModel?: string;
  initialApiKey?: string;
  onSaved?: () => void;
}

export function ConnectionForm({
  mode,
  connectionId,
  connectionName: initialName = '',
  initialProvider,
  initialModel = '',
  initialApiKey = '',
  onSaved,
}: ConnectionFormProps) {
  const { refreshConnections, setActiveConnection } = useConnection();
  const [providers, setProviders] = useState<ProviderModels[]>([]);
  const [connectionName, setConnectionName] = useState(initialName);
  const [provider, setProvider] = useState<LLMProvider | ''>(initialProvider || '');
  const [modelName, setModelName] = useState(initialModel);
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [saveEnabled, setSaveEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  // Reset test result when fields change
  useEffect(() => {
    setTestResult(null);
    setSaveEnabled(false);
    setError(null);
  }, [provider, modelName, apiKey]);

  const loadProviders = async () => {
    try {
      const data = await api.getProviders();
      setProviders(data);
    } catch (err) {
      console.error('Failed to load providers:', err);
    }
  };

  const selectedProviderModels = providers.find((p) => p.provider === provider)?.models || [];

  const handleTestConnection = async () => {
    if (!provider || !modelName || (!apiKey && provider !== 'ollama' && provider !== 'lmstudio')) {
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
    if (!saveEnabled) return;

    setIsSaving(true);
    setError(null);

    try {
      if (mode === 'new') {
        if (!connectionName.trim()) {
          setError('Connection name is required');
          setIsSaving(false);
          return;
        }
        const saved = await api.createConnection({
          connectionName: connectionName.trim(),
          provider: provider as string,
          modelName,
          apiKey,
        });
        // Set as active connection
        setActiveConnection({ ...saved, apiKey });
      } else if (connectionId) {
        const updated = await api.updateConnection(connectionId, {
          provider: provider as string,
          modelName,
          apiKey,
        });
        setActiveConnection({ ...updated, apiKey });
      }

      await refreshConnections();
      onSaved?.();

      if (mode === 'new') {
        // Reset form
        setConnectionName('');
        setProvider('');
        setModelName('');
        setApiKey('');
        setTestResult(null);
        setSaveEnabled(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save connection');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="connection-form">
      <div className="input-group">
        <label className="input-group__label">Connection Name</label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g., My GPT-4o Connection"
          value={connectionName}
          onChange={(e) => setConnectionName(e.target.value)}
          disabled={mode === 'edit'}
          style={mode === 'edit' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
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
            
            // Auto-select the first model if available
            const availableModels = providers.find(p => p.provider === newProvider)?.models || [];
            if (availableModels.length > 0) {
              setModelName(availableModels[0]);
            } else {
              setModelName('');
            }
          }}
        >
          <option value="">Select a provider...</option>
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
            placeholder="Enter model name (e.g., gpt-4o)"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
          />
        )}
      </div>

      {provider !== 'ollama' && provider !== 'lmstudio' && (
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
      )}

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
      <div className="connection-form__actions">
        <button
          className="btn btn--primary"
          onClick={handleTestConnection}
          disabled={isTesting || !provider || !modelName || (!apiKey && provider !== 'ollama' && provider !== 'lmstudio')}
        >
          {isTesting ? (
            <>
              <span className="btn__spinner" />
              Testing...
            </>
          ) : (
            <>
              <Plug size={16} />
              Test Connection
            </>
          )}
        </button>

        <button
          className="btn btn--success"
          onClick={handleSave}
          disabled={!saveEnabled || isSaving}
        >
          {isSaving ? (
            <>
              <span className="btn__spinner" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Connection
            </>
          )}
        </button>
      </div>
    </div>
  );
}
