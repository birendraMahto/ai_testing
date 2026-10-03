import React, { useState, useRef } from 'react';
import { Download, Loader2, Eye, Home, Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { PreviewModal } from '../components/PreviewModal';

const ReleaseNote = () => {
  const { toolConnections, llmConnections } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'with-id' | 'without-id'>('with-id');
  const [ticketId, setTicketId] = useState('');
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const [requirementText, setRequirementText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [useCustomTemplate, setUseCustomTemplate] = useState(false);
  const [customTemplateContent, setCustomTemplateContent] = useState('');
  const customTemplateRef = useRef<HTMLInputElement>(null);

  const [generationResult, setGenerationResult] = useState<any>(null);
  const [setOptions] = useState({
    includeTestCases: false,
    functional: false,
    regression: false,
    performance: false,
    security: false,
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  const activeTool = toolConnections.find(c => c.status === 'success') || null;
  const activeLLM = llmConnections.find(c => c.status === 'success') || null;

  const handleFetchDetails = async () => {
    if (!ticketId || !activeTool) return;
    setIsFetching(true);
    try {
      const response = await fetch('http://localhost:3001/api/tickets/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, toolConnection: activeTool })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to fetch ticket details');
        setTicketDetails(null);
      } else {
        setTicketDetails(data);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend API');
    } finally {
      setIsFetching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCustomTemplate = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsExtracting(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await fetch('http://localhost:3001/api/extract-text', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to extract text from file');
      } else {
        if (isCustomTemplate) {
          setCustomTemplateContent(data.text);
        } else {
          setRequirementText(data.text);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    } finally {
      setIsExtracting(false);
      if (isCustomTemplate) {
         if (customTemplateRef.current) customTemplateRef.current.value = '';
      } else {
         if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let finalTicketDetails = ticketDetails;
      if (activeTab === 'without-id') {
        finalTicketDetails = {
          id: 'N/A',
          title: 'Provided Requirement',
          status: 'N/A',
          assignee: 'N/A',
          priority: 'N/A',
          type: 'Requirement',
          description: requirementText,
          acceptanceCriteria: []
        };
      }

      const response = await fetch('http://localhost:3001/api/generate/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticketDetails: finalTicketDetails, 
          
          llmConnection: activeLLM, 
          documentType: 'release-note',
          customTemplate: useCustomTemplate ? customTemplateContent : null 
        })
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.error || 'Failed to generate');
      } else {
        setGenerationResult(data);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend API');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generationResult) return;
    try {
      const response = await fetch('http://localhost:3001/api/download/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: generationResult.plan })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ReleaseNote_${activeTab === 'with-id' ? ticketId : 'Requirement'}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

    const isReady = activeTab === 'with-id' ? !!ticketDetails : requirementText.trim().length > 0;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="heading-1" style={{ marginBottom: 0 }}>Create Release Note</h1>
        <button className="btn btn-outline" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Home size={18} /> Home
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button 
          className={`btn ${activeTab === 'with-id' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('with-id')}
        >
          With Ticket ID
        </button>
        <button 
          className={`btn ${activeTab === 'without-id' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('without-id')}
        >
          Without Ticket ID
        </button>
      </div>
      
      {activeTab === 'with-id' && (
        <>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Tool</label>
              <select className="input-field" disabled>
                <option>{activeTool ? `${activeTool.toolName} - ${activeTool.url}` : 'No tool connected'}</option>
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Enter Ticket ID</label>
              <input type="text" className="input-field" value={ticketId} onChange={(e) => setTicketId(e.target.value)} placeholder="e.g. PROJECT-123" />
            </div>
            <button className="btn btn-primary" onClick={handleFetchDetails} disabled={!ticketId || isFetching}>
              {isFetching ? <Loader2 className="animate-spin" size={18} /> : 'Fetch Details'}
            </button>
          </div>

          {ticketDetails && (
            <div className="glass-panel" style={{ padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.375rem', border: '1px solid var(--border-color)', maxHeight: '300px', overflowY: 'auto' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{ticketDetails.id}: {ticketDetails.title}</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                   <div><strong>Status:</strong> <span className="status-indicator status-green" style={{ display: 'inline-block', marginLeft: '4px' }}></span> {ticketDetails.status}</div>
                   <div><strong>Assignee:</strong> {ticketDetails.assignee}</div>
                   <div><strong>Priority:</strong> {ticketDetails.priority}</div>
                   <div><strong>Type:</strong> {ticketDetails.type}</div>
                </div>

                <div><strong>Description:</strong></div>
                <p className="text-muted" style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{ticketDetails.description}</p>
                
                <div style={{ marginTop: '1rem' }}><strong>Acceptance Criteria:</strong></div>
                <ul className="text-muted" style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  {ticketDetails.acceptanceCriteria?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'without-id' && (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontWeight: 500 }}>Paste Requirement or Attach Document (Word, PDF, TXT)</label>
            <div>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt,.pdf,.docx" style={{ display: 'none' }} />
              <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()} disabled={isExtracting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isExtracting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} Attach File
              </button>
            </div>
          </div>
          <textarea 
            className="input-field" 
            rows={10} 
            value={requirementText} 
            onChange={(e) => setRequirementText(e.target.value)} 
            placeholder="Paste your requirement text here..." 
            style={{ width: '100%', resize: 'vertical' }} 
          />
        </div>
      )}

      {isReady && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                <input type="checkbox" checked={useCustomTemplate} onChange={(e) => setUseCustomTemplate(e.target.checked)} />
                Generate Document from Template
             </label>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: useCustomTemplate ? 1 : 0.5, pointerEvents: useCustomTemplate ? 'auto' : 'none' }}>
                <input type="file" ref={customTemplateRef} onChange={(e) => handleFileUpload(e, true)} accept=".txt,.pdf,.docx" style={{ display: 'none' }} />
                <button className="btn btn-outline" onClick={() => customTemplateRef.current?.click()} disabled={isExtracting} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isExtracting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} Attach Template
                </button>
                {customTemplateContent && <span className="text-muted" style={{ fontSize: '0.9rem' }}>✓ Template uploaded</span>}
             </div>
          </div>

          <h2 className="heading-2">Generate Release Note</h2>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : 'Generate Note'}
          </button>

          {generationResult && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.375rem', textAlign: 'center', fontWeight: 500, marginBottom: '1rem' }}>
                Document is Generated successfully
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => { setPreviewData(generationResult.plan); setIsPreviewOpen(true); }}><Eye size={18} /> Preview Note</button>
                <button className="btn btn-outline" onClick={handleDownload}><Download size={18} /> Download Release Note</button>
                                              </div>
            </div>
          )}
        </div>
      )}
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Document Preview" content={previewData} />
    </div>
  );
};

export default ReleaseNote;
