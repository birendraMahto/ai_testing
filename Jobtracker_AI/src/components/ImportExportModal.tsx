import React, { useState } from 'react';
import { X, Download, Upload, Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import type { Job } from '../types/job';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  onImportData: (importedJobs: Job[]) => void;
  onResetSampleData: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onImportData,
  onResetSampleData,
}) => {
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `job-tracker-backup-${today}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          throw new Error('Invalid backup file. JSON must contain an array of jobs.');
        }
        // Basic validation of job items
        for (const item of parsed) {
          if (!item.id || !item.company || !item.title || !item.status) {
            throw new Error('JSON items missing required job fields (id, company, title, status).');
          }
        }
        onImportData(parsed);
        setImportStatus({
          type: 'success',
          message: `Successfully imported ${parsed.length} job cards!`,
        });
      } catch (err: any) {
        setImportStatus({
          type: 'error',
          message: err.message || 'Failed to parse JSON file.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 transition-all">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Backup & Restore
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% local JSON import and export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feedback Alert */}
        {importStatus.type && (
          <div
            className={`mt-4 p-3 rounded-xl flex items-center gap-2 text-xs ${
              importStatus.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {importStatus.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="py-5 space-y-4">
          {/* Export Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Export Data Backup
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Download {jobs.length} job cards as a local .json file
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Export JSON
            </button>
          </div>

          {/* Import Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Restore Data Backup
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Upload a previously saved .json backup file
              </p>
            </div>
            <label className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg shadow-sm cursor-pointer transition shrink-0">
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              Upload JSON
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reset / Demo Data */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Load Sample Data
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Reset database with sample cards for testing
              </p>
            </div>
            <button
              onClick={() => {
                onResetSampleData();
                setImportStatus({
                  type: 'success',
                  message: 'Loaded sample data into IndexedDB!',
                });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg transition shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Samples
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
