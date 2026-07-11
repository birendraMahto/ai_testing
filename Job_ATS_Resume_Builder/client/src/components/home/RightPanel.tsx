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

  if (loading) {
    return (
      <aside className="right-panel">
        <div className="right-panel__empty">
          <div className="spinner spinner--lg" style={{ marginBottom: '1rem' }} />
          <p className="right-panel__empty-title">Analyzing Resume...</p>
          <p className="right-panel__empty-desc">
            Please wait while AI evaluates your resume against the job description
          </p>
        </div>
      </aside>
    );
  }

  if (!analysis) {
    return (
      <aside className="right-panel">
        <div className="right-panel__empty">
          <ClipboardList className="right-panel__empty-icon" />
          <p className="right-panel__empty-title">Resume Score</p>
          <p className="right-panel__empty-desc">
            Submit a job description and resume to see your ATS score analysis here
          </p>
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
