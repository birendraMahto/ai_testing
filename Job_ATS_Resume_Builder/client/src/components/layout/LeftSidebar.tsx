import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Settings, Sun, Moon, Wifi } from 'lucide-react';
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
  const { theme, toggleTheme } = useTheme();
  const { activeConnection, connections } = useConnection();
  const [history, setHistory] = useState<HistorySummary[]>([]);

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

  const getScoreColor = (score: number): string => {
    if (score >= 7) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <div className="sidebar__section-title">
          <Clock size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
          History
        </div>
        <div className="history-list">
          {history.length === 0 ? (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.5rem', textAlign: 'center' }}>
              No analysis yet
            </p>
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

      <div className="sidebar__bottom">
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
