import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { AlertCircle } from 'lucide-react';

export const GatedRoute = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const { toolStatus, llmStatus } = useAppContext();

  if (!toolStatus || !llmStatus) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '2rem' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h2 className="heading-2">Access Blocked: {title}</h2>
        <p className="text-muted" style={{ maxWidth: '400px', marginBottom: '2rem', lineHeight: '1.5' }}>
          Set up a test management tool (Jira, ADO, etc.) and connect an LLM before continuing.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={() => window.location.href = '/'}>
            Home
          </button>
          <button className="btn btn-primary" onClick={() => window.location.href = '/settings'}>
            Go to Settings
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
