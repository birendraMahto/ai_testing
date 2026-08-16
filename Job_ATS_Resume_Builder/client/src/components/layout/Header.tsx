import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { useConnection } from '../../context/ConnectionContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({ title = 'Job Ready.AI', showBack = false }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeConnection } = useConnection();

  return (
    <header className="header">
      <div className="header__title">
        {showBack && (
          <button className="btn btn--ghost" onClick={() => navigate('/')} style={{ padding: '0.25rem', marginRight: '0.5rem' }}>
            <ArrowLeft size={20} />
          </button>
        )}
        <img src="/logo.jpg" alt="Job Ready.AI Logo" className="header__logo" style={{ height: '56px', width: 'auto', marginLeft: '0.25rem' }} />
      </div>
      <div className="header__actions">
        {activeConnection ? (
          <div className="header__connection-badge">
            <span className="header__connection-dot" />
            Connected
          </div>
        ) : (
          <div className="header__connection-badge">
            <span className="header__connection-dot header__connection-dot--inactive" />
            Not Connected
          </div>
        )}
        <button className="btn btn--ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <Bell size={20} />
        </button>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'var(--accent-primary)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '14px', marginLeft: '0.5rem'
        }}>
          RS
        </div>
      </div>
    </header>
  );
}
