import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/layout/LeftSidebar';
import { RightPanel } from '../components/home/RightPanel';
import { LocalLLMTab } from '../components/llm-settings/LocalLLMTab';
import { RemoteLLMTab } from '../components/llm-settings/RemoteLLMTab';
import { SavedConnectionsTab } from '../components/llm-settings/SavedConnectionsTab';
import { Monitor, Cloud, Server } from 'lucide-react';
import type { LLMConnection } from '../types';

export function LLMSettingsPage() {
  const [activeTab, setActiveTab] = useState<'local' | 'remote' | 'saved'>('saved');
  const [editingConnection, setEditingConnection] = useState<LLMConnection | null>(null);

  // When tab changes manually, clear editing mode
  const handleTabChange = (tab: 'local' | 'remote' | 'saved') => {
    setActiveTab(tab);
    if (tab !== 'local' && tab !== 'remote') {
      setEditingConnection(null);
    }
  };

  const handleEditConnection = (conn: LLMConnection) => {
    setEditingConnection(conn);
    // Determine if it's local or remote
    if (conn.provider === 'ollama' || conn.provider === 'lmstudio') {
      setActiveTab('local');
    } else {
      setActiveTab('remote');
    }
  };

  const handleCancelEdit = () => {
    setEditingConnection(null);
    setActiveTab('saved');
  };

  return (
    <>
      <Header title="Job Ready.AI" />
      <div className="app-layout">
        <LeftSidebar />
        
        <main className="center-panel" style={{ padding: '0' }}>
          {/* Top Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)', padding: '0 2rem' }}>
            <button
              style={{
                padding: '1.25rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'saved' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeTab === 'saved' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'saved' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleTabChange('saved')}
            >
              <Server size={18} style={{ color: activeTab === 'saved' ? 'var(--accent-primary)' : 'inherit' }} />
              Saved Connections
            </button>
            <button
              style={{
                padding: '1.25rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'local' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeTab === 'local' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'local' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleTabChange('local')}
            >
              <Monitor size={18} style={{ color: activeTab === 'local' ? 'var(--accent-primary)' : 'inherit' }} />
              Local LLM
            </button>
            <button
              style={{
                padding: '1.25rem 2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'remote' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                color: activeTab === 'remote' ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: activeTab === 'remote' ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleTabChange('remote')}
            >
              <Cloud size={18} style={{ color: activeTab === 'remote' ? 'var(--accent-primary)' : 'inherit' }} />
              Remote LLM
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '2.5rem' }}>
            {activeTab === 'saved' && <SavedConnectionsTab onEditConnection={handleEditConnection} />}
            {activeTab === 'local' && <LocalLLMTab editingConnection={editingConnection} onCancelEdit={handleCancelEdit} />}
            {activeTab === 'remote' && <RemoteLLMTab editingConnection={editingConnection} onCancelEdit={handleCancelEdit} />}
          </div>
        </main>
        
        <RightPanel analysis={null} loading={false} />
      </div>
    </>
  );
}
