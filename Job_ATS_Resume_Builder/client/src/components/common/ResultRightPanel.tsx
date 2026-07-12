import { useState } from 'react';
import { Copy, CheckCircle, Download, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../../services/api';

interface ResultRightPanelProps {
  title: string;
  content: string | null;
  isLoading?: boolean;
  filename?: string;
}

export function ResultRightPanel({ title, content, isLoading, filename = 'document.docx' }: ResultRightPanelProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleDownload = async () => {
    if (!content) return;
    setIsDownloading(true);
    try {
      const blob = await api.downloadDocument(content, filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error('Download failed', error);
      alert('Failed to download document');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <aside className="right-panel">
        <div className="right-panel__empty">
          <div className="spinner spinner--lg" style={{ marginBottom: '1rem' }} />
          <p className="right-panel__empty-title">Generating {title}...</p>
          <p className="right-panel__empty-desc">
            Please wait while AI drafts your content
          </p>
        </div>
      </aside>
    );
  }

  if (!content) {
    return (
      <aside className="right-panel">
        <div className="right-panel__empty">
          <FileText className="right-panel__empty-icon" />
          <p className="right-panel__empty-title">{title}</p>
          <p className="right-panel__empty-desc">
            Your generated {title.toLowerCase()} will appear here.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="right-panel">
      <div className="resume-preview animate-fadeIn">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
            {title}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn--outline btn--sm" onClick={handleCopy}>
              {isCopied ? <CheckCircle size={14} /> : <Copy size={14} />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>
            <button className="btn btn--primary btn--sm" onClick={handleDownload} disabled={isDownloading}>
              <Download size={14} />
              {isDownloading ? 'Downloading...' : 'Download DOCX'}
            </button>
          </div>
        </div>

        <div className="resume-preview__content markdown-response" style={{ overflowY: 'auto' }}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </aside>
  );
}
