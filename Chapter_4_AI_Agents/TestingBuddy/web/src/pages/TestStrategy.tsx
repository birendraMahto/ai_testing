import React, { useState } from 'react';
import { Download, Loader2, Eye } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { PreviewModal } from '../components/PreviewModal';

const TestStrategy = () => {
  const { toolConnections, llmConnections } = useAppContext();
  
  const [ticketId, setTicketId] = useState('');
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [options, setOptions] = useState({
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate/test-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketDetails, options, llmConnection: activeLLM })
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
      a.download = `TestStrategy_${ticketId}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="heading-1">Create Test Strategy</h1>
      
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
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '0.5rem' }}>
          <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.375rem', border: '1px solid var(--border-color)', marginBottom: '2rem', maxHeight: '300px', overflowY: 'auto' }}>
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
          <h2 className="heading-2">Generate Test Strategy</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
              <input type="checkbox" checked={options.includeTestCases} onChange={(e) => setOptions({...options, includeTestCases: e.target.checked})} />
              Include:
            </label>
            <div style={{ display: 'flex', gap: '1.5rem', marginLeft: '1.5rem', opacity: options.includeTestCases ? 1 : 0.5, pointerEvents: options.includeTestCases ? 'auto' : 'none' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={options.functional} onChange={(e) => setOptions({...options, functional: e.target.checked})} /> Functional Tests
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={options.regression} onChange={(e) => setOptions({...options, regression: e.target.checked})} /> Regression Tests
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={options.performance} onChange={(e) => setOptions({...options, performance: e.target.checked})} /> Performance Tests
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={options.security} onChange={(e) => setOptions({...options, security: e.target.checked})} /> Security Tests
              </label>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? <Loader2 className="animate-spin" size={18} /> : 'Generate Strategy'}
          </button>

          {generationResult && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '0.375rem', textAlign: 'center', fontWeight: 500, marginBottom: '1rem' }}>
                Document is Generated successfully
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-outline" onClick={() => { setPreviewData(generationResult.plan); setIsPreviewOpen(true); }}><Eye size={18} /> Preview Strategy</button>
                <button className="btn btn-outline" onClick={handleDownload}><Download size={18} /> Download Test Strategy</button>
                {options.includeTestCases && (
                  <button className="btn btn-outline" onClick={() => { setPreviewData(generationResult.cases); setIsPreviewOpen(true); }}><Eye size={18} /> Preview Cases</button>
                )}
                {options.includeTestCases && (
                  <button className="btn btn-outline" onClick={handleDownload}><Download size={18} /> Download Inclusion</button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Document Preview" content={previewData} />
    </div>
  );
};

export default TestStrategy;
