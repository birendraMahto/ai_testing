
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, ArrowLeft } from 'lucide-react';
import { useConnection } from '../../context/ConnectionContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title = 'Resume Builder', showBack = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeConnection } = useConnection();
  const isSettings = location.pathname.startsWith('/settings');

  return (
    <header className="header">
      <div className="header__title">
        {showBack && (
          <button className="btn btn--ghost" onClick={() => navigate('/')} style={{ color: '#fff', padding: '0.25rem' }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <span className="header__title-icon">📄</span>
        {isSettings ? 'LLM Settings Builder' : title}
      </div>
      <div className="header__actions">
        {activeConnection ? (
          <div className="header__connection-badge">
            <span className="header__connection-dot" />
            {activeConnection.connectionName}
          </div>
        ) : (
          <div className="header__connection-badge">
            <span className="header__connection-dot header__connection-dot--inactive" />
            No connection
          </div>
        )}
      </div>
    </header>
  );
}
