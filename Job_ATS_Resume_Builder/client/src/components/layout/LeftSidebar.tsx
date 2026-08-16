import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock, Settings, Sun, Moon, Wifi, Trash2, FileSearch, FileText, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useConnection } from '../../context/ConnectionContext';
import { api } from '../../services/api';
import type { HistorySummary } from '../../types';

interface LeftSidebarProps {
  onHistorySelect?: (id: string) => void;
  activeHistoryId?: string | null;
}

export function LeftSidebar({ onHistorySelect, activeHistoryId }: LeftSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { activeConnection, connections } = useConnection();
  const [history, setHistory] = useState<HistorySummary[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch {
      // Silent fail — history may be empty
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all history?')) return;
    setIsClearing(true);
    try {
      await api.clearHistory();
      setHistory([]);
      if (activeHistoryId && onHistorySelect) {
        onHistorySelect(''); // Deselect if currently viewing history
      }
    } catch (error) {
      console.error('Failed to clear history', error);
      alert('Failed to clear history');
    } finally {
      setIsClearing(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const handleToolNav = (path: string) => {
    if (!activeConnection) {
      alert('Please setup your LLM connection first in Settings.');
      return;
    }
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__section" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button 
          className={`sidebar__nav-btn sidebar__nav-btn--ats ${location.pathname === '/' ? 'sidebar__nav-btn--active' : ''}`}
          onClick={() => handleToolNav('/')}
        >
          <FileSearch size={18} />
          ATS Resume Scanner
        </button>
        <button 
          className={`sidebar__nav-btn sidebar__nav-btn--cover ${location.pathname === '/cover-letter' ? 'sidebar__nav-btn--active' : ''}`}
          onClick={() => handleToolNav('/cover-letter')}
        >
          <FileText size={18} />
          Cover Letter
        </button>
        <button 
          className={`sidebar__nav-btn sidebar__nav-btn--email ${location.pathname === '/follow-up-email' ? 'sidebar__nav-btn--active' : ''}`}
          onClick={() => handleToolNav('/follow-up-email')}
        >
          <Mail size={18} />
          Follow Up Email
        </button>
      </div>

      <div className="sidebar__section">
        <div className="sidebar__section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
            History
          </div>
          {history.length > 0 && (
            <button 
              onClick={handleClearHistory}
              disabled={isClearing}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: isClearing ? 'not-allowed' : 'pointer',
                padding: '0.25rem',
              }}
              title="Clear History"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <div className="history-list">
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No analysis yet</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Your scans will appear here</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className={`history-item ${activeHistoryId === item.id ? 'history-item--active' : ''}`}
                onClick={() => onHistorySelect?.(item.id)}
              >
                <span className="history-item__name">{item.resumeFileName}</span>
                <div className="history-item__meta">
                  <span className={`history-item__score history-item__score--${getScoreColor(item.scores.overall)}`}>
                    {item.scores.overall}/10
                  </span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ padding: '1rem', marginTop: 'auto' }}>
        <div style={{ background: 'var(--accent-purple)', borderRadius: '12px', padding: '1.25rem', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Stand Out. Get Noticed.</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.4 }}>
            AI-powered insights to boost your profile and land more interviews.
          </p>
          <button className="btn btn--primary btn--sm" style={{ padding: '0.5rem 1rem' }}>Learn More</button>
          <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', fontSize: '48px', opacity: 0.2 }}>
            🚀
          </div>
        </div>
      </div>

      <div className="sidebar__bottom" style={{ marginTop: 0 }}>
        <button className="sidebar__nav-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
          className={`sidebar__nav-btn ${activeConnection ? 'sidebar__nav-btn--active' : ''}`}
          onClick={() => navigate('/settings')}
        >
          <Settings size={18} />
          LLM Settings
        </button>

        {activeConnection && (
          <div style={{ marginTop: '0.5rem', padding: '0.375rem 0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.6875rem', color: 'var(--success)' }}>
              <Wifi size={12} />
              {activeConnection.connectionName}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
