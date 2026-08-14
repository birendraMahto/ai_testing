import React from 'react';
import { Columns, BarChart2 } from 'lucide-react';
import type { LinkedInProfile } from '../types/job';
import { LinkedinIcon } from './icons/LinkedinIcon';
import { HireStreamLogo } from './icons/HireStreamLogo';

interface HeaderProps {
  viewMode: 'kanban' | 'analytics';
  onViewModeChange: (mode: 'kanban' | 'analytics') => void;
  onOpenLinkedInModal: () => void;
  linkedInProfile?: LinkedInProfile;
  totalJobsCount: number;
  activeInterviewsCount: number;
  offersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onViewModeChange,
  onOpenLinkedInModal,
  linkedInProfile,
  totalJobsCount,
  activeInterviewsCount,
  offersCount,
}) => {
  const isConnected = linkedInProfile?.isConnected;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-xl border-b border-slate-200/90 dark:border-slate-800/90 shadow-xs">
      <div className="max-w-full mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* BRANDING & LOGO */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-1.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 shadow-xs">
              <HireStreamLogo className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                  HireStream
                </h1>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/30">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:flex items-center gap-2">
                <span>{totalJobsCount} apps</span>
                <span>•</span>
                <span>{activeInterviewsCount} interviews</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{offersCount} offers</span>
              </p>
            </div>
          </div>

          {/* SEGMENTED VIEW MODE SWITCHER */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shrink-0">
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Kanban Pipeline
            </button>
            <button
              onClick={() => onViewModeChange('analytics')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                viewMode === 'analytics'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              Analytics & Graphs
            </button>
          </div>

          {/* RIGHT SIDE LINKEDIN USER BADGE */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenLinkedInModal}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-xs shadow-xs transition-all duration-200 active:scale-[0.98] ${
                isConnected
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400/30 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={isConnected ? `Connected as ${linkedInProfile?.name}` : 'Connect LinkedIn Account'}
            >
              <LinkedinIcon className="w-3.5 h-3.5 text-white dark:text-blue-400" />
              <span className="truncate max-w-[120px]">
                {isConnected ? linkedInProfile?.name : 'Connect LinkedIn'}
              </span>
              {isConnected && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
