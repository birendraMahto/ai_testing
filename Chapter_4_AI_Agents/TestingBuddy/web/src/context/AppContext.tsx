import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ToolConnection {
  toolName: string;
  url: string;
  email: string;
  token: string;
  lastTested: string | null;
  status: 'success' | 'failed' | 'pending';
}

interface LLMConnection {
  connectionName: string;
  type: 'local' | 'remote';
  llmName: string;
  modelName: string;
  token?: string;
  lastTested: string | null;
  status: 'success' | 'failed' | 'pending';
}

interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toolConnections: ToolConnection[];
  addToolConnection: (conn: ToolConnection) => void;
  deleteToolConnection: (idx: number) => void;
  llmConnections: LLMConnection[];
  addLLMConnection: (conn: LLMConnection) => void;
  deleteLLMConnection: (idx: number) => void;
  toolStatus: boolean; // Computed or derived
  llmStatus: boolean; // Computed or derived
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [toolConnections, setToolConnections] = useState<ToolConnection[]>([]);
  const [llmConnections, setLLMConnections] = useState<LLMConnection[]>([]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const addToolConnection = (conn: ToolConnection) => {
    setToolConnections((prev) => [...prev, conn]);
  };

  const addLLMConnection = (conn: LLMConnection) => {
    setLLMConnections((prev) => [...prev, conn]);
  };

  const deleteToolConnection = (idx: number) => {
    setToolConnections((prev) => prev.filter((_, i) => i !== idx));
  };

  const deleteLLMConnection = (idx: number) => {
    setLLMConnections((prev) => prev.filter((_, i) => i !== idx));
  };

  const toolStatus = toolConnections.some((c) => c.status === 'success');
  const llmStatus = llmConnections.some((c) => c.status === 'success');

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        toolConnections,
        addToolConnection,
        deleteToolConnection,
        llmConnections,
        addLLMConnection,
        deleteLLMConnection,
        toolStatus,
        llmStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
