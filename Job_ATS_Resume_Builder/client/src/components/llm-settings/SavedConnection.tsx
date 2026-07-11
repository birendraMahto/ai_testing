import { useState, useEffect } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { ConnectionForm } from './ConnectionForm';
import { useConnection } from '../../context/ConnectionContext';
import type { LLMConnection, LLMProvider } from '../../types';

export function SavedConnection() {
  const { connections, refreshConnections } = useConnection();
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedConnection, setSelectedConnection] = useState<LLMConnection | null>(null);
  const [realApiKey, setRealApiKey] = useState('');

  useEffect(() => {
    refreshConnections();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const conn = connections.find((c) => c.id === id);
    if (conn) {
      setSelectedConnection(conn);
      setRealApiKey(''); // User needs to re-enter API key for security
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div className="connection-form__title">
        <Database size={20} style={{ color: 'var(--accent-primary)' }} />
        Saved Connections
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '2rem' }}>
        Select a saved connection to view, edit, or test
      </p>

      {/* Connection Dropdown */}
      <div className="input-group">
        <label className="input-group__label">Connection Name</label>
        <select
          className="select-field"
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="">Select a saved connection...</option>
          {connections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.connectionName}
            </option>
          ))}
        </select>
      </div>

      {/* Connection Form (Edit Mode) */}
      {selectedConnection && (
        <div className="animate-fadeIn" style={{ marginTop: '1.5rem' }}>
          <ConnectionForm
            key={selectedConnection.id}
            mode="edit"
            connectionId={selectedConnection.id}
            connectionName={selectedConnection.connectionName}
            initialProvider={selectedConnection.provider as LLMProvider}
            initialModel={selectedConnection.modelName}
            initialApiKey=""
            onSaved={() => refreshConnections()}
          />
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.75rem', textAlign: 'center' }}>
            For security, please re-enter your API key before testing
          </p>
        </div>
      )}

      {connections.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          <Database size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ fontSize: '0.875rem' }}>No saved connections yet</p>
          <p style={{ fontSize: '0.75rem' }}>Create a new connection first</p>
        </div>
      )}
    </div>
  );
}
