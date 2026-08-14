import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Zap,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  FileText,
  Building,
  Briefcase,
} from 'lucide-react';
import type { Job, JobStatus, EasyApplyOption } from '../types/job';
import { KANBAN_COLUMNS } from '../types/job';
import { LinkedinIcon } from './icons/LinkedinIcon';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Partial<Job>, customResumeName?: string) => void;
  initialJob?: Job | null;
  defaultStatus?: JobStatus;
  resumesList: string[];
}

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialJob,
  defaultStatus = 'new_openings',
  resumesList,
}) => {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<JobStatus>(defaultStatus);
  const [easyApply, setEasyApply] = useState<EasyApplyOption>('Yes');
  const [resumeUsed, setResumeUsed] = useState(resumesList[0] || 'FullStack_Engineer_2026');
  const [customResumeInput, setCustomResumeInput] = useState('');
  const [showAddResumeInput, setShowAddResumeInput] = useState(false);
  const [dateApplied, setDateApplied] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [location, setLocation] = useState('');
  const [jobPostedDate, setJobPostedDate] = useState('');
  const [notes, setNotes] = useState('');

  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);
  const [showEasyApplyPrompt, setShowEasyApplyPrompt] = useState(false);

  useEffect(() => {
    if (initialJob) {
      setLinkedinUrl(initialJob.linkedinUrl || '');
      setCompany(initialJob.company || '');
      setTitle(initialJob.title || '');
      setStatus(initialJob.status);
      setEasyApply(initialJob.easyApply || 'Yes');
      setResumeUsed(initialJob.resumeUsed || resumesList[0] || 'FullStack_Engineer_2026');
      setDateApplied(initialJob.dateApplied || '');
      setSalaryRange(initialJob.salaryRange || '');
      setLocation(initialJob.location || '');
      setJobPostedDate(initialJob.jobPostedDate || '');
      setNotes(initialJob.notes || '');
    } else {
      // Keep ALL fields blank for new job card additions
      setLinkedinUrl('');
      setCompany('');
      setTitle('');
      setStatus(defaultStatus);
      setEasyApply('Yes');
      setResumeUsed(resumesList[0] || 'FullStack_Engineer_2026');
      setDateApplied(''); // Blank
      setSalaryRange(''); // Blank
      setLocation(''); // Blank
      setJobPostedDate(''); // Blank
      setNotes(''); // Blank
    }
    setShowAddResumeInput(false);
    setCustomResumeInput('');
    setFetchSuccess(false);
    setShowEasyApplyPrompt(false);
  }, [initialJob, defaultStatus, isOpen, resumesList]);

  if (!isOpen) return null;

  // Extract real slug details from URL if present, otherwise leave fields blank
  const handleGetDetailsFromURL = () => {
    if (!linkedinUrl.trim()) return;

    setIsFetchingDetails(true);
    setFetchSuccess(false);

    setTimeout(() => {
      setIsFetchingDetails(false);
      setFetchSuccess(true);

      const rawUrl = linkedinUrl.trim();
      let extractedTitle = '';
      let extractedCompany = '';

      // Parse slug if available in URL (e.g. /jobs/view/senior-software-engineer-at-stripe-4123456789)
      const viewMatch = rawUrl.match(/\/jobs\/view\/([^/?#]+)/i);
      if (viewMatch && viewMatch[1] && !/^\d+$/.test(viewMatch[1])) {
        const slug = decodeURIComponent(viewMatch[1]);
        if (slug.includes('-at-')) {
          const parts = slug.split('-at-');
          extractedTitle = parts[0].replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          const compWithId = parts[1].replace(/-\d+$/, '');
          extractedCompany = compWithId.replace(/[-_]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
        } else {
          const cleanSlug = slug.replace(/-\d+$/, '').replace(/[-_]/g, ' ');
          extractedTitle = cleanSlug.replace(/\b\w/g, (l) => l.toUpperCase());
        }
      }

      // Populate ONLY if real slug details were parsed from URL; leave all other fields blank!
      if (extractedCompany) setCompany(extractedCompany);
      if (extractedTitle) setTitle(extractedTitle);
    }, 400);
  };

  // Easy Apply Click Action
  const handleEasyApplySubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const effectiveDate = dateApplied || today;

    const effectiveResume = showAddResumeInput && customResumeInput.trim()
      ? customResumeInput.trim()
      : resumeUsed;

    onSave(
      {
        linkedinUrl: linkedinUrl.trim(),
        company: company.trim(),
        title: title.trim(),
        status: 'applied',
        easyApply: 'Yes',
        resumeUsed: effectiveResume,
        dateApplied: effectiveDate,
        salaryRange: salaryRange.trim(),
        location: location.trim(),
        jobPostedDate: jobPostedDate.trim(),
        notes: notes.trim(),
      },
      showAddResumeInput && customResumeInput.trim() ? customResumeInput.trim() : undefined
    );

    onClose();
  };

  // Regular Save (Defaults to New Openings or chosen status)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim()) return;

    const effectiveResume = showAddResumeInput && customResumeInput.trim()
      ? customResumeInput.trim()
      : resumeUsed;

    onSave(
      {
        linkedinUrl: linkedinUrl.trim(),
        company: company.trim(),
        title: title.trim(),
        status: status || 'new_openings',
        easyApply,
        resumeUsed: effectiveResume,
        dateApplied: dateApplied.trim(),
        salaryRange: salaryRange.trim(),
        location: location.trim(),
        jobPostedDate: jobPostedDate.trim(),
        notes: notes.trim(),
      },
      showAddResumeInput && customResumeInput.trim() ? customResumeInput.trim() : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <LinkedinIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {initialJob ? 'Edit Job Card' : 'Add New Job Card'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste LinkedIn Job URL or fill in job card details
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

        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* TOP ROW: LinkedIn Job URL + "Get Details" Button */}
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
              <LinkedinIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              LinkedIn Job URL & Auto-Fetcher
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/jobs/view/123456789"
                  className="w-full pl-3.5 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleGetDetailsFromURL}
                disabled={isFetchingDetails || !linkedinUrl.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md transition shrink-0"
              >
                {isFetchingDetails ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Get Details
                  </>
                )}
              </button>
            </div>

            {fetchSuccess && (
              <p className="mt-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> URL parsed. Fill any remaining fields below.
              </p>
            )}
          </div>

          {/* ROW 2: Company Name & Job Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe, Vercel, Google"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                Job Title / Role <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* ROW 3: Kanban Status & Resume Used */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kanban Column / Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as JobStatus)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {KANBAN_COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title} ({col.description})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Resume Version
                </label>
                {!showAddResumeInput && (
                  <button
                    type="button"
                    onClick={() => setShowAddResumeInput(true)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    + Custom Resume
                  </button>
                )}
              </div>

              {showAddResumeInput ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customResumeInput}
                    onChange={(e) => setCustomResumeInput(e.target.value)}
                    placeholder="e.g. FullStack_v4_AI"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddResumeInput(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <select
                  value={resumeUsed}
                  onChange={(e) => setResumeUsed(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {resumesList.map((res) => (
                    <option key={res} value={res}>
                      {res}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* ROW 4: Salary Range & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                Salary Range (Optional)
              </label>
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. ₹25-30 LPA or $150-180K"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-500" />
                Job Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Bengaluru, India"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* ROW 5: Date Applied & Job Posted On */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                Date Applied
              </label>
              <input
                type="date"
                value={dateApplied}
                onChange={(e) => setDateApplied(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Job Posted On
              </label>
              <input
                type="text"
                value={jobPostedDate}
                onChange={(e) => setJobPostedDate(e.target.value)}
                placeholder="e.g. 2 days ago or 2026-07-20"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* ROW 6: EASY APPLY ACTION BUTTON SECTION */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                  LinkedIn Easy Apply
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                    {easyApply === 'Yes' ? 'Available Listing' : 'Standard Apply'}
                  </span>
                </h4>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                  {easyApply === 'Yes'
                    ? 'Click Easy Apply to select resume and apply today instantly'
                    : 'Easy Apply not available for this listing URL'}
                </p>
              </div>
            </div>

            {/* Interactive Easy Apply Button */}
            <button
              type="button"
              disabled={easyApply !== 'Yes'}
              onClick={() => setShowEasyApplyPrompt(true)}
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-md transition shrink-0 ${
                easyApply === 'Yes'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95 cursor-pointer shadow-amber-500/20'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              ⚡ Easy Apply Now
            </button>
          </div>

          {/* Easy Apply Resume Attachment Prompt Sub-Modal */}
          {showEasyApplyPrompt && (
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  Select Resume for Easy Apply Submission
                </h4>
                <button
                  type="button"
                  onClick={() => setShowEasyApplyPrompt(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attached Resume File / Version
                </label>
                <select
                  value={resumeUsed}
                  onChange={(e) => setResumeUsed(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 rounded-lg text-slate-900 dark:text-white"
                >
                  {resumesList.map((res) => (
                    <option key={res} value={res}>
                      📄 {res}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span>Date Applied: <strong>Today ({new Date().toLocaleDateString()})</strong></span>
                <button
                  type="button"
                  onClick={handleEasyApplySubmit}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Confirm & Submit Easy Apply
                </button>
              </div>
            </div>
          )}

          {/* ROW 7: Notes & Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes / Recruiter & Referral Info / Job Description
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Recruiter name, interview feedback, referral details, tech stack mentioned..."
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-600/20 active:scale-[0.98] transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              {initialJob ? 'Save Changes' : 'Save Job Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
