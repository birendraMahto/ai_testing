import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Moon, Sun, User } from 'lucide-react';

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useAppContext();

  return (
    <header className="glass-panel" style={{ background: 'var(--header-bg)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 2rem', borderLeft: 'none', borderRight: 'none', borderTop: 'none', height: '73px', borderRadius: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={toggleDarkMode} className="btn btn-outline" style={{ padding: '0.5rem', borderRadius: '50%' }}>
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="btn btn-primary">
          <User size={18} /> Login
        </button>
      </div>
    </header>
  );
};

export default Header;
