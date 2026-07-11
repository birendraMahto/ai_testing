
import { Plus } from 'lucide-react';
import { ConnectionForm } from './ConnectionForm';

export function NewConnection() {
  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <div className="connection-form__title">
        <Plus size={20} style={{ color: 'var(--accent-primary)' }} />
        New Connection
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', marginBottom: '2rem' }}>
        Configure a new LLM connection to use for resume analysis and building
      </p>
      <ConnectionForm mode="new" />
    </div>
  );
}
