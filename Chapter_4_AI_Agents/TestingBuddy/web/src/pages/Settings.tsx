import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { CheckCircle2, XCircle, Edit, Home, Trash2, Loader2 } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { 
    toolConnections, addToolConnection, deleteToolConnection,
    llmConnections, addLLMConnection, deleteLLMConnection 
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'tool' | 'llm'>('tool');
  
  // -- Tool Form State --
  const [activeToolSubTab, setActiveToolSubTab] = useState<'add' | 'saved'>('add');
  const [toolName, setToolName] = useState('');
  const [toolUrl, setToolUrl] = useState('');
  const [toolEmail, setToolEmail] = useState('');
  const [toolToken, setToolToken] = useState('');
  const [toolTestStatus, setToolTestStatus] = useState<'none' | 'success' | 'failed'>('none');

  // -- LLM Form State --
  // Aligning strictly with the llmconnection.jpg design
  const [activeLlmSubTab, setActiveLlmSubTab] = useState<'add' | 'saved'>('add');
  const [llmConnectionName, setLlmConnectionName] = useState('');
  const [llmProvider, setLlmProvider] = useState('');
  const [llmModel, setLlmModel] = useState('');
  const [llmToken, setLlmToken] = useState('');
  const [llmTestStatus, setLlmTestStatus] = useState<'none' | 'success' | 'failed'>('none');
  
  // -- Scanning State --
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<Record<string, string[]> | null>(null);

  // --- Handlers for Tool ---
  const handleTestTool = () => {
    setTimeout(() => {
      setToolTestStatus(toolName && toolUrl && toolEmail && toolToken ? 'success' : 'failed');
    }, 1000);
  };

  const handleSaveTool = () => {
    addToolConnection({
      toolName: toolName,
      url: toolUrl,
      email: toolEmail,
      token: toolToken,
      lastTested: new Date().toISOString(),
      status: 'success'
    });
    resetToolForm();
    setActiveToolSubTab('saved');
  };

  const handleEditTool = (conn: any, idx: number) => {
    setToolName(conn.toolName);
    setToolUrl(conn.url);
    setToolEmail(conn.email);
    setToolToken(conn.token);
    setToolTestStatus('none');
    deleteToolConnection(idx); // Remove old one to replace
    setActiveToolSubTab('add');
  };

  const resetToolForm = () => {
    setToolName(''); setToolUrl(''); setToolEmail(''); setToolToken(''); setToolTestStatus('none');
  };

  // --- Handlers for LLM ---
  const handleTestLLM = () => {
    setTimeout(() => {
      setLlmTestStatus(llmConnectionName && llmProvider && llmModel ? 'success' : 'failed');
    }, 1000);
  };

  const handleSaveLLM = () => {
    addLLMConnection({
      connectionName: llmConnectionName,
      type: llmToken ? 'remote' : 'local', // simple heuristic for mock
      llmName: llmProvider,
      modelName: llmModel,
      token: llmToken,
      lastTested: new Date().toISOString(),
      status: 'success'
    });
    resetLlmForm();
    setActiveLlmSubTab('saved');
  };

  const handleEditLLM = (conn: any, idx: number) => {
    setLlmConnectionName(conn.connectionName);
    setLlmProvider(conn.llmName);
    setLlmModel(conn.modelName);
    setLlmToken(conn.token || '');
    setLlmTestStatus('none');
    deleteLLMConnection(idx);
    setActiveLlmSubTab('add');
  };

  const resetLlmForm = () => {
    setLlmConnectionName(''); setLlmProvider(''); setLlmModel(''); setLlmToken(''); setLlmTestStatus('none');
  };

  const handleScanLocalLLM = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScannedData({
        'Ollama': ['llama3:latest', 'mistral:latest', 'phi3:latest'],
        'LMStudio': ['qwen-2-7b', 'llama-3-8b-instruct', 'gemma-2b']
      });
      setLlmProvider('Ollama');
      setLlmModel('llama3:latest');
      setActiveLlmSubTab('add');
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      <h1 className="heading-1">Settings</h1>
      
      {/* Top Level Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'tool' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('tool')}
          style={{ width: '200px' }}
        >
          Test Management Tool
        </button>
        <button 
          className={`btn ${activeTab === 'llm' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('llm')}
          style={{ width: '200px' }}
        >
          LLM Connection
        </button>
      </div>

      {activeTab === 'tool' && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '0.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
             <button className={`btn ${activeToolSubTab === 'add' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveToolSubTab('add')}>
                Add Connection
             </button>
             <button className={`btn ${activeToolSubTab === 'saved' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveToolSubTab('saved')}>
                Saved Connection
             </button>
             <button className="btn btn-outline" onClick={() => navigate('/')}>
                <Home size={16} /> Home
             </button>
          </div>

          {activeToolSubTab === 'add' && (
            <>
              <h2 className="heading-2">Add Connection</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', maxWidth: '600px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Connection Name</label>
                  <input type="text" className="input-field" value={toolName} onChange={(e) => setToolName(e.target.value)} placeholder="e.g. My Jira Instance" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>URL</label>
                  <input type="text" className="input-field" value={toolUrl} onChange={(e) => setToolUrl(e.target.value)} placeholder="https://your-domain.atlassian.net" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                  <input type="email" className="input-field" value={toolEmail} onChange={(e) => setToolEmail(e.target.value)} placeholder="you@company.com" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>API Token</label>
                  <input type="password" className="input-field" value={toolToken} onChange={(e) => setToolToken(e.target.value)} placeholder="Enter API Token" />
                </div>
                
                {toolTestStatus === 'success' && <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle2 size={18}/> Test connection successful</div>}
                {toolTestStatus === 'failed' && <div style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><XCircle size={18}/> Connection failed. Check details.</div>}

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-outline" onClick={handleTestTool}>Test Connection</button>
                  <button className="btn btn-primary" disabled={toolTestStatus !== 'success'} onClick={handleSaveTool}>Save Connection</button>
                  <button className="btn btn-outline" onClick={resetToolForm}>Reset</button>
                  <button className="btn btn-outline" onClick={resetToolForm}>Cancel</button>
                </div>
              </div>
            </>
          )}

          {activeToolSubTab === 'saved' && (
            <>
              <h2 className="heading-2">Saved Connections</h2>
              {toolConnections.length === 0 ? (
                <p className="text-muted">No connections saved yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                  {toolConnections.map((conn, idx) => (
                    <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{conn.toolName}</div>
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>{conn.url}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                           <span className={`status-indicator ${conn.status === 'success' ? 'status-green' : 'status-red'}`}></span>
                           <span>Last tested: {new Date(conn.lastTested || '').toLocaleString()}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline" onClick={() => handleEditTool(conn, idx)}>
                          <Edit size={16} /> Edit
                        </button>
                        <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => deleteToolConnection(idx)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'llm' && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '0.5rem' }}>
          
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 600 }}>
             Add/Edit LLM Connections
          </div>

          <div style={{ display: 'flex', gap: '2rem' }}>
            {/* Left Vertical Sub-buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '200px' }}>
               <button className="btn btn-outline" style={{ borderColor: 'var(--border-color)' }} onClick={handleScanLocalLLM} disabled={isScanning}>
                  {isScanning ? <Loader2 className="animate-spin" size={18} style={{ display: 'inline' }} /> : 'Scan Local LLM'}
               </button>
               <button className={`btn ${activeLlmSubTab === 'add' ? 'btn-outline' : 'btn-outline'}`} style={{ borderColor: activeLlmSubTab === 'add' ? 'var(--primary)' : 'var(--border-color)', color: activeLlmSubTab === 'add' ? 'var(--primary)' : 'inherit' }} onClick={() => setActiveLlmSubTab('add')}>
                  Add Connection
               </button>
               <button className={`btn ${activeLlmSubTab === 'saved' ? 'btn-outline' : 'btn-outline'}`} style={{ borderColor: activeLlmSubTab === 'saved' ? 'var(--primary)' : 'var(--border-color)', color: activeLlmSubTab === 'saved' ? 'var(--primary)' : 'inherit' }} onClick={() => setActiveLlmSubTab('saved')}>
                  Saved Connection
               </button>
               <button className="btn btn-outline" onClick={() => navigate('/')}>
                  Home
               </button>
            </div>

            {/* Right Form Area */}
            <div style={{ flex: 1 }}>
               {activeLlmSubTab === 'add' && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: '1rem' }}>
                      <label style={{ fontWeight: 500 }}>Connection Name</label>
                      <input type="text" className="input-field" value={llmConnectionName} onChange={e => setLlmConnectionName(e.target.value)} placeholder="e.g. My Local AI" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: '1rem' }}>
                      <label style={{ fontWeight: 500 }}>Select LLM</label>
                      {scannedData ? (
                        <select className="input-field" value={llmProvider} onChange={e => { setLlmProvider(e.target.value); setLlmModel(scannedData[e.target.value]?.[0] || ''); }}>
                          {Object.keys(scannedData).map(provider => <option key={provider} value={provider}>{provider}</option>)}
                        </select>
                      ) : (
                        <input type="text" className="input-field" value={llmProvider} onChange={e => setLlmProvider(e.target.value)} placeholder="Run Scan or type Provider (e.g. OpenAI)" />
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: '1rem' }}>
                      <label style={{ fontWeight: 500 }}>Select/Enter Model Name</label>
                      {scannedData && scannedData[llmProvider] ? (
                        <select className="input-field" value={llmModel} onChange={e => setLlmModel(e.target.value)}>
                          {scannedData[llmProvider].map(model => <option key={model} value={model}>{model}</option>)}
                        </select>
                      ) : (
                        <input type="text" className="input-field" value={llmModel} onChange={e => setLlmModel(e.target.value)} placeholder="e.g. gpt-4" />
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', alignItems: 'center', gap: '1rem' }}>
                      <label style={{ fontWeight: 500 }}>API Token</label>
                      <input type="password" className="input-field" value={llmToken} onChange={e => setLlmToken(e.target.value)} placeholder="Optional for Local LLM" />
                    </div>

                    {llmTestStatus === 'success' && <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}><CheckCircle2 size={18}/> Test connection successful</div>}
                    {llmTestStatus === 'failed' && <div style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}><XCircle size={18}/> Connection failed.</div>}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                      <button className="btn btn-outline" onClick={handleTestLLM} style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>Test Connection</button>
                      <button className="btn btn-outline" disabled={llmTestStatus !== 'success'} onClick={handleSaveLLM} style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>Save Connection</button>
                      <button className="btn btn-outline" onClick={resetLlmForm}>Reset</button>
                      <button className="btn btn-outline" onClick={resetLlmForm}>Cancel</button>
                    </div>
                 </div>
               )}

               {activeLlmSubTab === 'saved' && (
                 <>
                    {llmConnections.length === 0 ? (
                      <p className="text-muted">No LLM connections saved yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {llmConnections.map((conn, idx) => (
                          <div key={idx} style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{conn.connectionName}</div>
                              <div className="text-muted" style={{ fontSize: '0.9rem' }}>{conn.llmName} - {conn.modelName}</div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                 <span className={`status-indicator ${conn.status === 'success' ? 'status-green' : 'status-red'}`}></span>
                                 <span>Last tested: {new Date(conn.lastTested || '').toLocaleString()}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-outline" onClick={() => handleEditLLM(conn, idx)}>
                                <Edit size={16} /> Edit
                              </button>
                              <button className="btn btn-outline" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => deleteLLMConnection(idx)}>
                                <Trash2 size={16} /> Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                 </>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
