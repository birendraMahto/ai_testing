import React, { useState, useEffect, useMemo } from 'react';
import type { Job, JobStatus, LinkedInProfile, ResumeItem } from './types/job';
import {
  initDB,
  seedSampleDataIfEmpty,
  addJob,
  updateJob,
  deleteJob,
  updateJobsBatch,
  bulkImportJobs,
  saveCustomResume,
  getAllResumeItems,
  saveResumeItem,
  deleteResumeItem,
  getLinkedInProfileSettings,
  saveLinkedInProfileSettings,
} from './db/indexedDB';
import { DEFAULT_LINKEDIN_PROFILE } from './services/linkedinService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FilterToolbar } from './components/FilterToolbar';
import { KanbanBoard } from './components/KanbanBoard';
import { AnalyticsView } from './components/AnalyticsView';
import { JobModal } from './components/JobModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ImportExportModal } from './components/ImportExportModal';
import { LinkedInConnectModal } from './components/LinkedInConnectModal';
import { ResumeBoxModal } from './components/ResumeBoxModal';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('jobtracker-theme');
    return saved ? saved === 'dark' : true;
  });

  // View Mode: 'kanban' | 'analytics'
  const [viewMode, setViewMode] = useState<'kanban' | 'analytics'>('kanban');

  // Jobs, Resumes, and Profile State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumesList, setResumesList] = useState<string[]>([]);
  const [resumeItems, setResumeItems] = useState<ResumeItem[]>([]);
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile>(DEFAULT_LINKEDIN_PROFILE);
  const [loading, setLoading] = useState<boolean>(true);

  // Kanban Search & Global Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResumeFilter, setSelectedResumeFilter] = useState('');
  const [selectedEasyApplyFilter, setSelectedEasyApplyFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'company-asc' | 'company-desc'>('date-desc');

  // Specific New Openings Column Filters
  const [newOpeningsLocationFilter, setNewOpeningsLocationFilter] = useState('All Locations');
  const [newOpeningsLimitFilter, setNewOpeningsLimitFilter] = useState(10);

  // Modal Control States
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState<JobStatus>('new_openings');

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isResumeBoxOpen, setIsResumeBoxOpen] = useState(false);

  // Apply dark mode class to documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jobtracker-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jobtracker-theme', 'light');
    }
  }, [darkMode]);

  // Load Initial Data from IndexedDB
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const loadedJobs = await seedSampleDataIfEmpty();
        setJobs(loadedJobs);
        const rItems = await getAllResumeItems();
        setResumeItems(rItems);
        setResumesList(rItems.map((r) => r.name));
        const profile = await getLinkedInProfileSettings();
        setLinkedInProfile(profile);
      } catch (error) {
        console.error('Failed to load IndexedDB data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Filter and Sort Jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = jobs.filter((j) => !j.isDismissed);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (j) => j.company.toLowerCase().includes(q) || j.title.toLowerCase().includes(q)
      );
    }

    // Resume filter
    if (selectedResumeFilter) {
      result = result.filter((j) => j.resumeUsed === selectedResumeFilter);
    }

    // Easy Apply filter
    if (selectedEasyApplyFilter) {
      result = result.filter((j) => j.easyApply === selectedEasyApplyFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.dateApplied || b.createdAt).getTime() - new Date(a.dateApplied || a.createdAt).getTime();
      }
      if (sortBy === 'date-asc') {
        return new Date(a.dateApplied || a.createdAt).getTime() - new Date(b.dateApplied || b.createdAt).getTime();
      }
      if (sortBy === 'company-asc') {
        return a.company.localeCompare(b.company);
      }
      if (sortBy === 'company-desc') {
        return b.company.localeCompare(a.company);
      }
      return 0;
    });

    return result;
  }, [jobs, searchQuery, selectedResumeFilter, selectedEasyApplyFilter, sortBy]);

  // Stats calculation
  const totalJobsCount = jobs.filter((j) => !j.isDismissed).length;
  const activeInterviewsCount = jobs.filter((j) => j.status === 'interview' && !j.isDismissed).length;
  const offersCount = jobs.filter((j) => j.status === 'offer' && !j.isDismissed).length;

  // Add / Edit Job Handler
  const handleSaveJob = async (jobData: Partial<Job>, customResumeName?: string) => {
    if (customResumeName) {
      await saveCustomResume(customResumeName);
      const rItems = await getAllResumeItems();
      setResumeItems(rItems);
      setResumesList(rItems.map((r) => r.name));
    }

    if (editingJob) {
      const updated: Job = {
        ...editingJob,
        ...jobData,
        updatedAt: Date.now(),
      } as Job;

      await updateJob(updated);
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } else {
      const newJob: Job = {
        id: 'job-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        company: jobData.company || '',
        title: jobData.title || '',
        linkedinUrl: jobData.linkedinUrl,
        resumeUsed: jobData.resumeUsed || resumesList[0] || 'Default_Resume',
        dateApplied: jobData.dateApplied || '',
        salaryRange: jobData.salaryRange,
        easyApply: jobData.easyApply || 'Yes',
        notes: jobData.notes,
        status: jobData.status || defaultModalStatus,
        location: jobData.location,
        jobPostedDate: jobData.jobPostedDate,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        order: jobs.length,
      };

      await addJob(newJob);
      setJobs((prev) => [newJob, ...prev]);
    }
  };

  // Delete Job Handler
  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    await deleteJob(deleteConfirmId);
    setJobs((prev) => prev.filter((j) => j.id !== deleteConfirmId));
    setDeleteConfirmId(null);
  };

  // Dismiss Job Handler
  const handleDismissJob = async (id: string) => {
    const target = jobs.find((j) => j.id === id);
    if (!target) return;
    const updated: Job = { ...target, isDismissed: true, updatedAt: Date.now() };
    await updateJob(updated);
    setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
  };

  // Move single card to column
  const handleMoveJobStatus = async (targetJob: Job, newStatus: JobStatus) => {
    const updated: Job = {
      ...targetJob,
      status: newStatus,
      updatedAt: Date.now(),
    };
    await updateJob(updated);
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
  };

  // Drag and drop batch update
  const handleJobsChange = async (updatedJobs: Job[]) => {
    setJobs(updatedJobs);
    await updateJobsBatch(updatedJobs);
  };

  // Import JSON handler
  const handleImportData = async (importedJobs: Job[]) => {
    await bulkImportJobs(importedJobs);
    setJobs(importedJobs);
    const rItems = await getAllResumeItems();
    setResumeItems(rItems);
    setResumesList(rItems.map((r) => r.name));
  };

  // Reset to Sample Data
  const handleResetSampleData = async () => {
    const db = await initDB();
    await db.clear('jobs');
    const freshJobs = await seedSampleDataIfEmpty();
    setJobs(freshJobs);
  };

  // Save LinkedIn Profile
  const handleSaveLinkedInProfile = async (profile: LinkedInProfile) => {
    setLinkedInProfile(profile);
    await saveLinkedInProfileSettings(profile);
  };

  // Resume Box Handlers
  const handleAddResumeItem = async (newItem: ResumeItem) => {
    await saveResumeItem(newItem);
    const rItems = await getAllResumeItems();
    setResumeItems(rItems);
    setResumesList(rItems.map((r) => r.name));
  };

  const handleDeleteResumeItem = async (id: string) => {
    await deleteResumeItem(id);
    const rItems = await getAllResumeItems();
    setResumeItems(rItems);
    setResumesList(rItems.map((r) => r.name));
  };

  // Open modal helpers
  const handleOpenAdd = (status: JobStatus = 'new_openings') => {
    setEditingJob(null);
    setDefaultModalStatus(status);
    setIsJobModalOpen(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };

  const jobToDelete = useMemo(
    () => jobs.find((j) => j.id === deleteConfirmId),
    [jobs, deleteConfirmId]
  );

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors overflow-hidden">
      {/* 1. TOP HEADER BAR */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
        linkedInProfile={linkedInProfile}
        totalJobsCount={totalJobsCount}
        activeInterviewsCount={activeInterviewsCount}
        offersCount={offersCount}
      />

      {/* 2. MAIN APP CONTAINER (LEFT SIDEBAR + RIGHT BOARD AREA) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* COLLAPSIBLE & RESIZABLE LEFT SIDEBAR */}
        <Sidebar
          onOpenAddModal={() => handleOpenAdd('new_openings')}
          onOpenResumeBox={() => setIsResumeBoxOpen(true)}
          onOpenImportExport={() => setIsImportExportOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0b0f19] overflow-hidden">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-medium text-slate-500">Loading HireStream IndexedDB Vault...</p>
              </div>
            </div>
          ) : viewMode === 'kanban' ? (
            <>
              {/* SEARCH & FILTER TOOLBAR PLACED RIGHT ABOVE KANBAN BOARD WITH CLEAN GAP */}
              <FilterToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedResumeFilter={selectedResumeFilter}
                onResumeFilterChange={setSelectedResumeFilter}
                selectedEasyApplyFilter={selectedEasyApplyFilter}
                onEasyApplyFilterChange={setSelectedEasyApplyFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                resumesList={resumesList}
              />

              {/* KANBAN BOARD PIPELINE */}
              <KanbanBoard
                jobs={filteredAndSortedJobs}
                onJobsChange={handleJobsChange}
                onEditJob={handleOpenEdit}
                onDeleteJob={(id) => setDeleteConfirmId(id)}
                onAddJobToColumn={handleOpenAdd}
                onMoveJobStatus={handleMoveJobStatus}
                onDismissJob={handleDismissJob}
                locationFilter={newOpeningsLocationFilter}
                onLocationFilterChange={setNewOpeningsLocationFilter}
                limitFilter={newOpeningsLimitFilter}
                onLimitFilterChange={setNewOpeningsLimitFilter}
              />
            </>
          ) : (
            <AnalyticsView jobs={jobs} />
          )}
        </div>
      </div>

      {/* Add / Edit Job Modal */}
      <JobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSave={handleSaveJob}
        initialJob={editingJob}
        defaultStatus={defaultModalStatus}
        resumesList={resumesList}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        companyName={jobToDelete?.company}
      />

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        jobs={jobs}
        onImportData={handleImportData}
        onResetSampleData={handleResetSampleData}
      />

      {/* LinkedIn Connect & Account Modal */}
      <LinkedInConnectModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        profile={linkedInProfile}
        onSaveProfile={handleSaveLinkedInProfile}
      />

      {/* Resume Box Management Modal */}
      <ResumeBoxModal
        isOpen={isResumeBoxOpen}
        onClose={() => setIsResumeBoxOpen(false)}
        resumes={resumeItems}
        onAddResume={handleAddResumeItem}
        onDeleteResume={handleDeleteResumeItem}
      />
    </div>
  );
};

export default App;
