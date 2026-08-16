import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { saveAs } from 'file-saver';
import {
  BarChart3, TrendingUp, Layout, FileCheck, PenTool, Zap,
  CheckCircle, AlertTriangle, XCircle, Lightbulb,
  Wand2, Download, FileText, Loader2, ClipboardList
} from 'lucide-react';
import type { AnalysisResult, BuiltResume } from '../../types';
import { api } from '../../services/api';
import { useConnection } from '../../context/ConnectionContext';

interface RightPanelProps {
  analysis: AnalysisResult | null;
  loading: boolean;
}

export function RightPanel({ analysis, loading }: RightPanelProps) {
  const { activeConnection } = useConnection();
  const [builtResume, setBuiltResume] = useState<BuiltResume | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showResume, setShowResume] = useState(false);
  const [buildError, setBuildError] = useState<string | null>(null);

  if (loading || !analysis) {
    return (
      <aside className="right-panel" style={{ padding: '2rem 1.5rem', background: 'var(--bg-tertiary)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* What You'll Get */}
        <div className="card animate-fadeIn">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>What You'll Get</h3>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-purple)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>ATS Compatibility Score</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>See how well your resume passes ATS filters</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Keyword & Skills Insights</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Find missing keywords and optimize content</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dcfce7', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Detailed Improvement Tips</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Actionable suggestions to strengthen your resume</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffedd5', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="22" y1="12" x2="18" y2="12"></line><line x1="6" y1="12" x2="2" y2="12"></line><line x1="12" y1="6" x2="12" y2="2"></line><line x1="12" y1="22" x2="12" y2="18"></line></svg>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Job Match Score</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>See how well your profile matches the role</p>
            </div>
          </div>
        </div>

        {/* Resume Score Preview */}
        <div className="card animate-fadeIn">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Resume Score Preview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
            {loading ? (
               <div className="spinner spinner--lg" style={{ marginBottom: '1.5rem', width: '80px', height: '80px', borderWidth: '4px' }} />
            ) : (
               <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                 <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 800 }}>--</span>
               </div>
            )}
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'center' }}>
              {loading ? 'Analyzing...' : 'Your ATS Score will appear here'}
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '200px' }}>
              {loading ? 'Please wait while AI evaluates your resume against the job description.' : 'Submit a job description and resume to get your score'}
            </p>
          </div>
        </div>

        {/* Enterprise Grade Security */}
        <div style={{ background: 'var(--accent-purple)', borderRadius: '12px', padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
           <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
           </div>
           <div>
             <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Enterprise Grade Security</h4>
             <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>We follow industry best practices to keep your data safe and private.</p>
             <a href="#" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Learn more &rarr;</a>
           </div>
        </div>

      </aside>
    );
  }

  const { scores, feedback, rawResponse } = analysis;

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'var(--score-high)';
    if (score >= 4) return 'var(--score-medium)';
    return 'var(--score-low)';
  };

  const scoreItems = [
    { label: 'Effectivity', value: scores.effectivity, icon: <TrendingUp size={14} /> },
    { label: 'Layout & Design', value: scores.layoutDesign, icon: <Layout size={14} /> },
    { label: 'Content Relevance', value: scores.contentRelevance, icon: <FileCheck size={14} /> },
    { label: 'Grammar & Syntax', value: scores.grammarSyntax, icon: <PenTool size={14} /> },
    { label: 'Impact', value: scores.impact, icon: <Zap size={14} /> },
  ];

  const handleBuildResume = async () => {
    if (!analysis) return;
    setIsBuilding(true);
    setBuildError(null);

    try {
      const result = await api.buildResume({
        analysisId: analysis.id,
        connectionId: activeConnection?.id || analysis.connectionId,
      });
      setBuiltResume(result);
      setShowResume(true);
    } catch (err: any) {
      setBuildError(err.message || 'Failed to build resume');
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDownload = async (format: 'docx' | 'pdf') => {
    if (!builtResume) return;
    setIsDownloading(true);

    try {
      if (format === 'docx') {
        const blob = await api.downloadResume(builtResume.analysisId, 'docx');
        if (blob instanceof Blob) {
          saveAs(blob, 'improved_resume.docx');
        }
      } else {
        // For PDF: create a printable window
        const content = builtResume.content;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html><head><title>Improved Resume</title>
            <style>
              body { font-family: 'Georgia', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; color: #333; }
              h1 { font-size: 24px; border-bottom: 2px solid #333; padding-bottom: 8px; }
              h2 { font-size: 18px; color: #555; margin-top: 20px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
              h3 { font-size: 15px; color: #666; }
              ul { margin: 8px 0; }
              li { margin-bottom: 4px; }
            </style></head><body>
            <pre style="white-space: pre-wrap; font-family: inherit;">${content}</pre>
            </body></html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <aside className="right-panel">
      {showResume && builtResume ? (
        <div className="resume-preview animate-fadeIn">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wand2 size={16} style={{ color: 'var(--accent-primary)' }} />
              Improved Resume
            </h3>
            <button className="btn btn--ghost btn--sm" onClick={() => setShowResume(false)}>
              Back to Score
            </button>
          </div>

          <div className="resume-preview__content markdown-response">
            <ReactMarkdown>{builtResume.content}</ReactMarkdown>
          </div>

          <div className="resume-preview__actions">
            <button
              className="btn btn--primary btn--sm"
              onClick={() => handleDownload('docx')}
              disabled={isDownloading}
            >
              <Download size={14} />
              Download Word
            </button>
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
            >
              <FileText size={14} />
              Download PDF
            </button>
          </div>
        </div>
      ) : (
        <div className="score-card animate-slideRight">
          {/* Overall Score */}
          <div className="score-card__header">
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>ATS Score Analysis</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{analysis.resumeFileName}</p>
            </div>
            <div className="score-card__overall">
              <span className="score-card__overall-value" style={{ color: getScoreColor(scores.overall) }}>
                {scores.overall}
              </span>
              <span className="score-card__overall-label">out of 10</span>
            </div>
          </div>

          {/* Individual Scores */}
          <div className="score-card__section">
            <div className="score-card__section-title">
              <BarChart3 size={14} style={{ color: 'var(--accent-primary)' }} />
              Section Scores
            </div>
            {scoreItems.map((item) => (
              <div className="score-bar" key={item.label}>
                <span className="score-bar__label">{item.label}</span>
                <div className="score-bar__track">
                  <div
                    className="score-bar__fill"
                    style={{
                      width: `${(item.value / 10) * 100}%`,
                      background: getScoreColor(item.value),
                    }}
                  />
                </div>
                <span className="score-bar__value" style={{ color: getScoreColor(item.value) }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          {/* Feedback Sections */}
          {feedback.positives.length > 0 && (
            <div className="score-card__section">
              <div className="score-card__section-title">
                <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                Strengths
              </div>
              <ul className="feedback-list">
                {feedback.positives.map((item, i) => (
                  <li key={i} className="feedback-list__item">
                    <CheckCircle size={14} className="feedback-list__icon" style={{ color: 'var(--success)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.improvements.length > 0 && (
            <div className="score-card__section">
              <div className="score-card__section-title">
                <AlertTriangle size={14} style={{ color: 'var(--warning)' }} />
                Areas for Improvement
              </div>
              <ul className="feedback-list">
                {feedback.improvements.map((item, i) => (
                  <li key={i} className="feedback-list__item">
                    <AlertTriangle size={14} className="feedback-list__icon" style={{ color: 'var(--warning)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {feedback.missingKeywords.length > 0 && (
            <div className="score-card__section">
              <div className="score-card__section-title">
                <XCircle size={14} style={{ color: 'var(--error)' }} />
                Missing Keywords
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {feedback.missingKeywords.map((kw, i) => (
                  <span key={i} className="badge badge--error">{kw}</span>
                ))}
              </div>
            </div>
          )}

          {feedback.suggestions.length > 0 && (
            <div className="score-card__section">
              <div className="score-card__section-title">
                <Lightbulb size={14} style={{ color: 'var(--info)' }} />
                Suggestions
              </div>
              <ul className="feedback-list">
                {feedback.suggestions.map((item, i) => (
                  <li key={i} className="feedback-list__item">
                    <Lightbulb size={14} className="feedback-list__icon" style={{ color: 'var(--info)' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Full Analysis */}
          <div className="score-card__section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <details>
              <summary style={{ cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                View Full Analysis
              </summary>
              <div className="markdown-response" style={{ marginTop: '0.75rem' }}>
                <ReactMarkdown>{rawResponse}</ReactMarkdown>
              </div>
            </details>
          </div>

          {/* Resume Builder Button */}
          <div style={{ padding: '0 0 1rem', marginTop: '0.5rem' }}>
            <button
              className="btn btn--success btn--full"
              onClick={handleBuildResume}
              disabled={isBuilding}
            >
              {isBuilding ? (
                <>
                  <span className="btn__spinner" />
                  Building Improved Resume...
                </>
              ) : (
                <>
                  <Wand2 size={16} />
                  Resume Builder
                </>
              )}
            </button>
            {buildError && (
              <p style={{ color: 'var(--error)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.5rem' }}>
                {buildError}
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
