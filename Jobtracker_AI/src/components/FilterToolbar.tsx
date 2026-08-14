import React from 'react';
import { Search, Filter, ArrowUpDown, X } from 'lucide-react';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedResumeFilter: string;
  onResumeFilterChange: (res: string) => void;
  selectedEasyApplyFilter: string;
  onEasyApplyFilterChange: (ea: string) => void;
  sortBy: 'date-desc' | 'date-asc' | 'company-asc' | 'company-desc';
  onSortChange: (sort: 'date-desc' | 'date-asc' | 'company-asc' | 'company-desc') => void;
  resumesList: string[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedResumeFilter,
  onResumeFilterChange,
  selectedEasyApplyFilter,
  onEasyApplyFilterChange,
  sortBy,
  onSortChange,
  resumesList,
}) => {
  const hasActiveFilters = searchQuery || selectedResumeFilter || selectedEasyApplyFilter;

  const clearFilters = () => {
    onSearchChange('');
    onResumeFilterChange('');
    onEasyApplyFilterChange('');
  };

  return (
    <div className="px-6 pt-4 pb-2 bg-slate-50/80 dark:bg-[#0b0f19]/80 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
      {/* Search and Filters directly above the Kanban Board */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        {/* Search Input */}
        <div className="relative min-w-[220px] max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company, title, or skills..."
            className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Resume Filter */}
        <div className="relative">
          <select
            value={selectedResumeFilter}
            onChange={(e) => onResumeFilterChange(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="">All Resumes</option>
            {resumesList.map((res) => (
              <option key={res} value={res}>
                {res}
              </option>
            ))}
          </select>
          <Filter className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Easy Apply Filter */}
        <div className="relative">
          <select
            value={selectedEasyApplyFilter}
            onChange={(e) => onEasyApplyFilterChange(e.target.value)}
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="">Easy Apply: All</option>
            <option value="Yes">Easy Apply: Yes</option>
            <option value="No">Easy Apply: No</option>
          </select>
          <Filter className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Sort Options */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(e.target.value as 'date-desc' | 'date-asc' | 'company-asc' | 'company-desc')
            }
            className="appearance-none pl-3 pr-7 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="company-asc">Company (A-Z)</option>
            <option value="company-desc">Company (Z-A)</option>
          </select>
          <ArrowUpDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold px-1"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
