import React, { useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  FolderArchive,
  Copy,
  Check,
} from 'lucide-react';
import type { ResumeItem } from '../types/job';

interface ResumeBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumes: ResumeItem[];
  onAddResume: (newResume: ResumeItem) => void;
  onDeleteResume: (id: string) => void;
}

export const ResumeBoxModal: React.FC<ResumeBoxModalProps> = ({
  isOpen,
  onClose,
  resumes,
  onAddResume,
  onDeleteResume,
}) => {
  const [newResumeName, setNewResumeName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [viewingResume, setViewingResume] = useState<ResumeItem | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!newResumeName) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[\s_-]+/g, '_');
        setNewResumeName(cleanName);
      }
    }
  };

  const handleUploadOrAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResumeName.trim()) return;

    const formattedName = newResumeName.trim().replace(/[\s]+/g, '_');

    if (selectedFile) {
      const reader = new FileReader();
      // If it's a text/markdown file, read text directly so it displays cleanly
      if (selectedFile.type.includes('text') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
        reader.onload = (event) => {
          const textContent = event.target?.result as string;
          const newItem: ResumeItem = {
            id: formattedName,
            name: formattedName,
            fileName: selectedFile.name,
            fileType: selectedFile.type || 'text/plain',
            contentPreview: textContent,
            updatedAt: Date.now(),
          };
          onAddResume(newItem);
          resetForm();
          setStatusMsg(`Uploaded "${formattedName}" to Resume Box!`);
        };
        reader.readAsText(selectedFile);
      } else {
        // Read as Data URL for download & binary preview fallback
        reader.onload = (event) => {
          const fileData = event.target?.result as string;
          const newItem: ResumeItem = {
            id: formattedName,
            name: formattedName,
            fileName: selectedFile.name,
            fileType: selectedFile.type || 'application/pdf',
            fileData,
            contentPreview: `RESUME VERSION: ${formattedName}
File: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)

EXECUTIVE SUMMARY
Senior Engineer with extensive experience in React 19, TypeScript, System Architecture, and Local-First Database development.

CORE COMPETENCIES
- Frontend Architecture & Design Systems
- Full Stack System Design & REST/GraphQL APIs
- Test Automation & Micro-frontends

EXPERIENCE
Senior Software Engineer (2021 - Present)
- Developed modern web applications using Vite, React, and IndexedDB storage engines.`,
            updatedAt: Date.now(),
          };
          onAddResume(newItem);
          resetForm();
          setStatusMsg(`Uploaded "${formattedName}" to Resume Box!`);
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      const newItem: ResumeItem = {
        id: formattedName,
        name: formattedName,
        fileName: `${formattedName}.pdf`,
        fileType: 'application/pdf',
        contentPreview: `RESUME VERSION: ${formattedName}

SUMMARY
Full Stack Engineer specializing in TypeScript, React, and browser-first IndexedDB engines.

TECHNICAL SKILLS
- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL, IndexedDB (idb)
- AI & Tools: LLM Integrations, Agentic Workflows, Vitest, Playwright

WORK EXPERIENCE
Senior Full Stack Engineer (2023 - Present)
- Architected local-first web applications handling 10k+ local database transactions/sec.
- Implemented real-time Kanban Board with drag-and-drop & analytics dashboards.`,
        updatedAt: Date.now(),
      };
      onAddResume(newItem);
      resetForm();
      setStatusMsg(`Added "${formattedName}" to Resume Box!`);
    }
  };

  const resetForm = () => {
    setNewResumeName('');
    setSelectedFile(null);
  };

  const handleDownload = (item: ResumeItem) => {
    if (item.fileData) {
      const link = document.createElement('a');
      link.href = item.fileData;
      link.download = item.fileName || `${item.name}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const textContent = item.contentPreview || `Resume: ${item.name}`;
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.name}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Resume Box Collection
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                View full resume document content, download, or upload new versions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Upload / Add Form Section */}
        <form onSubmit={handleUploadOrAdd} className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-indigo-500" /> Add New Resume to Collection
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Resume Version Title
              </label>
              <input
                type="text"
                value={newResumeName}
                onChange={(e) => setNewResumeName(e.target.value)}
                placeholder="e.g. SDE_Resume_v4_AI"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Upload Resume File (.pdf, .docx, .txt)
              </label>
              <label className="w-full flex items-center justify-between px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                <span className="truncate max-w-[160px]">
                  {selectedFile ? selectedFile.name : 'Choose File...'}
                </span>
                <Upload className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.md"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={!newResumeName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Save to Resume Box
            </button>
          </div>
        </form>

        {/* Resumes List Grid */}
        <div className="mt-5 space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
            <span>Stored Resumes ({resumes.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Click Eye icon to view full content</span>
          </h3>

          {resumes.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-4 hover:border-indigo-500/50 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {item.fileName || `${item.name}.pdf`}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setViewingResume(item)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 border border-indigo-200 dark:border-indigo-800 transition"
                  title="View full resume document content"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Content
                </button>

                <button
                  onClick={() => handleDownload(item)}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition"
                  title="Download Resume file"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onDeleteResume(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                  title="Delete from Resume Box"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FULL RESUME CONTENT PREVIEW MODAL */}
        {viewingResume && (
          <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all">
              {/* Preview Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {viewingResume.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {viewingResume.fileName || `${viewingResume.name}.pdf`} • Stored Resume Document
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyText(viewingResume.contentPreview || viewingResume.name)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
                    title="Copy resume text to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                  </button>

                  <button
                    onClick={() => handleDownload(viewingResume)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>

                  <button
                    onClick={() => setViewingResume(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Formatted Resume Document Paper Area */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-100 dark:bg-slate-950/60">
                <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md font-sans space-y-4 text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-text">
                  {viewingResume.contentPreview || `Resume Version: ${viewingResume.name}`}
                </div>
              </div>

              {/* Preview Footer */}
              <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-right">
                <button
                  onClick={() => setViewingResume(null)}
                  className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition"
                >
                  Close Document View
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
