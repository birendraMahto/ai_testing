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
    <main className="center-panel">
      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
        {/* Welcome Section */}
        <div className="animate-fadeIn" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            ATS Resume Scanner
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Paste your job description, attach your resume, and get AI-powered ATS scoring
          </p>
        </div>

        {/* JD Input */}
        <div className="card animate-fadeIn" style={{ marginBottom: '1rem', animationDelay: '0.1s' }}>
          <div className="card__title">
            <Search size={16} style={{ color: 'var(--accent-primary)' }} />
            Job Description
          </div>
          <textarea
            className="input-field input-field--textarea"
            placeholder="Paste the job description or JD link from LinkedIn here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            style={{ minHeight: '180px' }}
          />
        </div>

        {/* File Upload */}
        <div className="card animate-fadeIn" style={{ marginBottom: '1.5rem', animationDelay: '0.2s' }}>
          <div className="card__title">
            <Upload size={16} style={{ color: 'var(--accent-primary)' }} />
            Attach Resume
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.docx"
            style={{ display: 'none' }}
          />
          {selectedFile ? (
            <div className="file-upload file-upload--active">
              <div className="file-upload__attached">
                <FileText size={18} />
                <span>{selectedFile.name}</span>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={handleRemoveFile}
                  style={{ color: 'var(--error)', marginLeft: '0.5rem' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
              <Upload className="file-upload__icon" />
              <p className="file-upload__text">Click to upload your resume</p>
              <p className="file-upload__hint">Supported formats: .pdf, .docx (Max 10MB)</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="animate-scaleIn" style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.75rem 1rem', background: 'var(--error-bg)',
            border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px',
            color: 'var(--error)', fontSize: '0.8125rem', marginBottom: '1rem'
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          className="btn btn--primary btn--lg btn--full"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !activeConnection}
          style={{ animationDelay: '0.3s' }}
        >
          {isAnalyzing ? (
            <>
              <span className="btn__spinner" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Search size={18} />
              Check Resume Score
            </>
          )}
        </button>

        {!activeConnection && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
            ⚠️ Configure LLM connection in Settings before scoring
          </p>
        )}
      </div>
    </main>
  );
}
