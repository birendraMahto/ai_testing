import { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useConnection } from '../../context/ConnectionContext';

interface CoverLetterPanelProps {
  onGenerate: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export function CoverLetterPanel({ onGenerate, isLoading }: CoverLetterPanelProps) {
  const { activeConnection } = useConnection();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription || !resumeFile || !activeConnection) return;

    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('resume', resumeFile);
    formData.append('connectionId', activeConnection.id);

    onGenerate(formData);
  };

  return (
    <main className="center-panel">
      <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%' }}>
        <div className="animate-fadeIn" style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Cover Letter Generator
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Enter a job description or URL, attach your resume, and let AI craft the perfect cover letter.
          </p>
        </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
        
        {/* JD Input */}
        <div className="card animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <div className="card__title">
            <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
            Job Description or URL
          </div>
          <textarea
            className="input-field input-field--textarea"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here, or enter a URL (e.g., https://example.com/job/123)"
            rows={8}
            disabled={isLoading}
            style={{ minHeight: '180px', width: '100%', resize: 'vertical' }}
          />
        </div>

        {/* File Upload */}
        <div className="card animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="card__title">
            <Upload size={16} style={{ color: 'var(--accent-primary)' }} />
            Attach Resume
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            disabled={isLoading}
          />
          
          {resumeFile ? (
            <div className="file-upload file-upload--active">
              <div className="file-upload__attached">
                <FileText size={18} />
                <span>{resumeFile.name}</span>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={(e) => { e.stopPropagation(); handleClear(); }}
                  style={{ color: 'var(--error)', marginLeft: '0.5rem' }}
                  disabled={isLoading}
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

        {!activeConnection && (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
            ⚠️ Configure LLM connection in Settings before generating
          </p>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', animationDelay: '0.3s' }} className="animate-fadeIn">
          <button 
            type="button" 
            className="btn btn--secondary" 
            style={{ flex: 1 }} 
            onClick={handleClear}
            disabled={isLoading}
          >
            Reset / Clear
          </button>
          <button 
            type="submit" 
            className="btn btn--primary" 
            style={{ flex: 2 }}
            disabled={isLoading || (!jobDescription && !resumeFile) || !activeConnection}
          >
            {isLoading ? (
              <>
                <span className="btn__spinner" />
                Generating...
              </>
            ) : (
              'Create Cover Letter'
            )}
          </button>
        </div>
      </form>
      </div>
    </main>
  );
}
