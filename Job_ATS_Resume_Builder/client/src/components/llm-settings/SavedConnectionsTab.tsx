import { useConnection } from '../../context/ConnectionContext';
import { api } from '../../services/api';
import { Server, Edit2, Trash2, CheckCircle2, Monitor, Cloud } from 'lucide-react';
import type { LLMConnection } from '../../types';

interface SavedConnectionsTabProps {
  onEditConnection: (conn: LLMConnection) => void;
}

export function SavedConnectionsTab({ onEditConnection }: SavedConnectionsTabProps) {
  const { connections, activeConnection, setActiveConnection, refreshConnections } = useConnection();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this connection?')) return;
    try {
      await api.deleteConnection(id);
      if (activeConnection?.id === id) {
        setActiveConnection(null);
      }
      await refreshConnections();
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete connection.');
    }
  };

  const isLocalProvider = (provider: string) => provider === 'ollama' || provider === 'lmstudio';

  if (connections.length === 0) {
    return (
      <div className="right-panel__empty" style={{ width: '100%', height: '300px' }}>
        <Server className="right-panel__empty-icon" />
        <h3 className="right-panel__empty-title">No Saved Connections</h3>
        <p className="right-panel__empty-desc">
          You haven't saved any local or remote connections yet. Go to the Local or Remote tab to create one.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div className="connection-form__title">
          <Server size={20} style={{ color: 'var(--accent-primary)' }} />
          Saved Connections
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
          Manage your saved local and remote LLM connections.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {connections.map((conn) => {
          const isActive = activeConnection?.id === conn.id;
          const isLocal = isLocalProvider(conn.provider);

          return (
            <div
              key={conn.id}
              className="card"
              style={{
                borderLeft: isActive ? '4px solid var(--success)' : undefined,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                      {conn.connectionName}
                    </h3>
                    <span
                      className="badge"
                      style={{
                        background: isLocal ? 'var(--bg-tertiary)' : 'var(--accent-purple)',
                        color: isLocal ? 'var(--text-secondary)' : 'var(--accent-primary)',
                      }}
                    >
                      {isLocal ? <Monitor size={12} /> : <Cloud size={12} />}
                      {isLocal ? 'Local' : 'Remote'}
                    </span>
                    {isActive && (
                      <span className="badge badge--success">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <strong>Provider:</strong> {conn.provider} &nbsp;|&nbsp; <strong>Model:</strong> {conn.modelName}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!isActive && (
                    <button
                      className="btn btn--secondary btn--sm"
                      onClick={() => setActiveConnection(conn)}
                      title="Set as Active"
                    >
                      <CheckCircle2 size={14} /> Activate
                    </button>
                  )}
                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => onEditConnection(conn)}
                    title="Edit"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    className="btn btn--danger btn--sm"
                    onClick={() => handleDelete(conn.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
