import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { LLMConnection } from '../types';
import { api } from '../services/api';

interface ConnectionContextType {
  activeConnection: LLMConnection | null;
  connections: LLMConnection[];
  setActiveConnection: (conn: LLMConnection | null) => void;
  refreshConnections: () => Promise<void>;
  loading: boolean;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [activeConnection, setActiveConnectionState] = useState<LLMConnection | null>(null);
  const [connections, setConnections] = useState<LLMConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshConnections = async () => {
    try {
      const data = await api.getConnections();
      setConnections(data);
    } catch (err) {
      console.error('Failed to load connections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshConnections();
  }, []);

  // Restore active connection from localStorage
  useEffect(() => {
    if (connections.length > 0) {
      const savedId = localStorage.getItem('ats-active-connection');
      if (savedId) {
        const found = connections.find((c) => c.id === savedId);
        if (found) setActiveConnectionState(found);
      }
    }
  }, [connections]);

  const setActiveConnection = (conn: LLMConnection | null) => {
    setActiveConnectionState(conn);
    if (conn) {
      localStorage.setItem('ats-active-connection', conn.id);
    } else {
      localStorage.removeItem('ats-active-connection');
    }
  };

  return (
    <ConnectionContext.Provider
      value={{ activeConnection, connections, setActiveConnection, refreshConnections, loading }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error('useConnection must be used within ConnectionProvider');
  return context;
}
