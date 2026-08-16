import { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, Search } from 'lucide-react';
import { useConnection } from '../../context/ConnectionContext';
import { api } from '../../services/api';
import type { AnalysisResult } from '../../types';

interface CenterPanelProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  onLoading: (loading: boolean) => void;
}

export function CenterPanel({ onAnalysisComplete, onLoading }: CenterPanelProps) {
  const { activeConnection } = useConnection();
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.toLowerCase();
      if (!ext.endsWith('.pdf') && !ext.endsWith('.docx')) {
        setError('Only .pdf and .docx files are supported');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    setError(null);

    if (!activeConnection) {
      setError('Please configure LLM settings first. Click "LLM Settings" in the sidebar.');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please paste a job description');
      return;
    }

    if (!selectedFile) {
      setError('Please attach your resume (.pdf or .docx)');
      return;
    }

    setIsAnalyzing(true);
    onLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('jobDescription', jobDescription);
      formData.append('connectionId', activeConnection.id);

      const result = await api.analyzeResume(formData);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      onLoading(false);
    }
  };

  return (
    <main className="center-panel" style={{ padding: '2rem 3rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        {/* Hero Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
          <div style={{ maxWidth: '400px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Build a Strong Profile.<br/>
              <span style={{ color: 'var(--accent-primary)' }}>Get Job Ready with AI.</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Scan your resume, optimize your content, and match with the right opportunities. Your dream job is one step closer.
            </p>
          </div>
          {/* Mockup Card Illustration */}
          <div style={{ position: 'relative', width: '200px', height: '160px', background: '#fff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(95, 99, 242, 0.15)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                <FileText size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', width: '80%', marginBottom: '6px' }} />
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', width: '60%' }} />
              </div>
            </div>
            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', width: '100%', marginBottom: '8px' }} />
            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', width: '90%', marginBottom: '8px' }} />
            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', width: '70%' }} />
            
            {/* Score Badge */}
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: '#fff', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)', border: '4px solid #10b981' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>92</span>
              <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: 600 }}>ATS Score</span>
              <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', background: '#10b981', color: '#fff', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
          </div>
        </div>

        {/* JD Input */}
        <div className="card animate-fadeIn" style={{ marginBottom: '1.5rem', padding: '2rem' }}>
          <div className="card__title" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>1</div>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Job Description / JD Link</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '0.25rem' }}>Paste the job description or JD link from LinkedIn</p>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <textarea
              className="input-field input-field--textarea"
              placeholder="Paste job description or JD link here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              style={{ minHeight: '140px', background: 'transparent', resize: 'none' }}
            />
            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', color: 'var(--text-muted)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="card animate-fadeIn" style={{ marginBottom: '2rem', padding: '2rem' }}>
          <div className="card__title" style={{ gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>2</div>
            <div>
              <h3 style={{ fontSize: '1rem', margin: 0 }}>Upload Your Resume</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '0.25rem' }}>Upload your resume (PDF/DOCX) for ATS analysis</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx"
            style={{ display: 'none' }}
          />
          {selectedFile ? (
            <div className="file-upload file-upload--active" style={{ padding: '2rem' }}>
              <div className="file-upload__attached">
                <FileText size={24} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{selectedFile.name}</span>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={handleRemoveFile}
                  style={{ color: 'var(--error)', marginLeft: '1rem' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="file-upload" onClick={() => fileInputRef.current?.click()} style={{ padding: '2.5rem', background: '#fafafa', borderStyle: 'dashed', borderWidth: '2px', borderColor: '#e2e8f0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)' }}>
                <Upload size={24} />
              </div>
              <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Drag & drop your resume here</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>or click to browse files</p>
              <p className="file-upload__hint">Supported formats: PDF, DOCX &bull; Max size: 10MB</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="animate-scaleIn" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '1rem', background: 'var(--error-bg)',
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px',
            color: 'var(--error)', fontSize: '0.875rem', marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          className="btn btn--primary btn--lg btn--full"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !activeConnection}
          style={{ height: '56px', fontSize: '1.0625rem', borderRadius: '12px', boxShadow: '0 8px 20px rgba(95, 99, 242, 0.3)' }}
        >
          {isAnalyzing ? (
            <>
              <span className="btn__spinner" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
              Analyze My Resume
            </>
          )}
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Your data is secure and confidential. We never share your information.
        </p>

        {!activeConnection && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
            ⚠️ Configure LLM connection in Settings before scoring
          </p>
        )}
      </div>
    </main>
  );
}
