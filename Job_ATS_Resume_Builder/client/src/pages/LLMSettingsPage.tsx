import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { NewConnection } from '../components/llm-settings/NewConnection';
import { SavedConnection } from '../components/llm-settings/SavedConnection';
import { Plus, Database, ArrowLeft } from 'lucide-react';

type SettingsView = 'new' | 'saved';

export function LLMSettingsPage() {
  const [activeView, setActiveView] = useState<SettingsView>('new');
  const navigate = useNavigate();

  return (
    <>
      <Header title="LLM Settings Builder" showBack />
      <div className="app-layout">
        {/* Left Sidebar for Settings */}
        <aside className="sidebar">
          <div className="sidebar__section">
            <div className="sidebar__section-title">LLM Settings</div>

            <button
              className={`sidebar__nav-btn ${activeView === 'new' ? 'sidebar__nav-btn--active' : ''}`}
              onClick={() => setActiveView('new')}
            >
              <Plus size={18} />
              New Connection
            </button>

            <button
              className={`sidebar__nav-btn ${activeView === 'saved' ? 'sidebar__nav-btn--active' : ''}`}
              onClick={() => setActiveView('saved')}
            >
              <Database size={18} />
              Saved Connection
            </button>
          </div>

          <div className="sidebar__bottom">
            <button
              className="sidebar__nav-btn"
              onClick={async () => {
                try {
                  const { api } = await import('../services/api');
                  const res = await api.scanLocalConnections();
                  alert(`Successfully added ${res.added} local models! Check your Saved Connections.`);
                  // Force a small reload or state update if possible, but alert is fine for now
                  if (res.added > 0) setActiveView('saved');
                } catch (e: any) {
                  alert(`Failed to scan: ${e.message}`);
                }
              }}
            >
              <Database size={18} />
              Scan Local LLMs
            </button>
            <button className="sidebar__nav-btn" onClick={() => navigate('/')} style={{ marginTop: '0.5rem' }}>
              <ArrowLeft size={18} />
              Back to Home
            </button>
          </div>
        </aside>

        {/* Center Panel */}
        <main className="center-panel">
          {activeView === 'new' ? <NewConnection /> : <SavedConnection />}
        </main>

        {/* Empty Right Panel */}
        <div className="right-panel">
          <div className="right-panel__empty">
            <Database size={48} style={{ opacity: 0.15, marginBottom: '1rem' }} />
            <p className="right-panel__empty-title">Connection Info</p>
            <p className="right-panel__empty-desc">
              Configure your LLM connection to enable AI-powered resume analysis
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
