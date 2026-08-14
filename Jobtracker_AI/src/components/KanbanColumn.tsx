import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Inbox, MapPin, Eye } from 'lucide-react';
import type { ColumnDefinition, Job, JobStatus } from '../types/job';
import { JobCard } from './JobCard';

interface KanbanColumnProps {
  column: ColumnDefinition;
  jobs: Job[];
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onAddJobToColumn: (status: JobStatus) => void;
  onMoveJobStatus: (job: Job, newStatus: JobStatus) => void;
  onDismissJob?: (id: string) => void;
  // Controls for New Openings column
  locationFilter?: string;
  onLocationFilterChange?: (loc: string) => void;
  limitFilter?: number;
  onLimitFilterChange?: (limit: number) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  jobs,
  onEditJob,
  onDeleteJob,
  onAddJobToColumn,
  onMoveJobStatus,
  onDismissJob,
  locationFilter = 'All Locations',
  onLocationFilterChange,
  limitFilter = 10,
  onLimitFilterChange,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const jobIds = jobs.map((j) => j.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-80 sm:w-84 shrink-0 rounded-2xl bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 max-h-[calc(100vh-140px)] transition-all duration-200 ${
        isOver ? 'ring-2 ring-indigo-500/50 bg-indigo-50/30 dark:bg-indigo-950/20' : ''
      }`}
    >
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-col gap-2.5 sticky top-0 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-t-2xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-2.5 h-2.5 rounded-full ${column.color.dot}`} />
            <h2 className="font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight">
              {column.title}
            </h2>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${column.color.badgeBg} ${column.color.badgeText}`}
            >
              {jobs.length}
            </span>
          </div>

          <button
            onClick={() => onAddJobToColumn(column.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            title={`Add job to ${column.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Specific Controls for New Openings Column */}
        {column.id === 'new_openings' && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
            {/* Hierarchical Location Dropdown (Country, State, City, Remote) */}
            <div className="relative flex-1 min-w-0">
              <select
                value={locationFilter}
                onChange={(e) => onLocationFilterChange && onLocationFilterChange(e.target.value)}
                className="w-full appearance-none pl-6 pr-5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800/80 rounded-md text-sky-900 dark:text-sky-200 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer truncate"
              >
                <option value="All Locations">🌍 All Locations</option>
                <option value="Remote">🌐 Remote Worldwide</option>

                <optgroup label="🇺🇸 United States">
                  <option value="United States">🇺🇸 United States (All US)</option>
                  <option value="California">California (SF / Silicon Valley)</option>
                  <option value="San Francisco">San Francisco, CA</option>
                  <option value="San Jose">San Jose, CA</option>
                  <option value="New York">New York, NY</option>
                  <option value="Texas">Austin, TX</option>
                  <option value="Seattle">Seattle, WA</option>
                </optgroup>

                <optgroup label="🇮🇳 India">
                  <option value="India">🇮🇳 India (All India)</option>
                  <option value="Bengaluru">Bengaluru, Karnataka</option>
                  <option value="Hyderabad">Hyderabad, Telangana</option>
                  <option value="Mumbai">Mumbai / Pune</option>
                  <option value="Delhi">Gurugram / Delhi NCR</option>
                </optgroup>

                <optgroup label="🇬🇧 United Kingdom">
                  <option value="London">🇬🇧 London, UK</option>
                </optgroup>

                <optgroup label="🇨🇦 Canada">
                  <option value="Toronto">🇨🇦 Toronto, ON</option>
                </optgroup>
              </select>
              <MapPin className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-sky-500 pointer-events-none" />
            </div>

            {/* Limit Display Count Selector */}
            <div className="relative shrink-0">
              <select
                value={limitFilter}
                onChange={(e) => onLimitFilterChange && onLimitFilterChange(Number(e.target.value))}
                className="appearance-none pl-5 pr-4 py-1 text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                title="Select maximum number of jobs to display"
              >
                <option value={3}>Limit: 3</option>
                <option value={5}>Limit: 5</option>
                <option value={10}>Limit: 10</option>
                <option value={999}>Limit: All</option>
              </select>
              <Eye className="w-3 h-3 absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Cards List Container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[160px] custom-scrollbar">
        <SortableContext items={jobIds} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEditJob}
              onDelete={onDeleteJob}
              onMoveStatus={onMoveJobStatus}
              onDismiss={onDismissJob}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {jobs.length === 0 && (
          <div className="h-36 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-600 px-4 text-center">
            <Inbox className="w-6 h-6 mb-1.5 opacity-60" />
            <p className="text-xs font-medium">No jobs in {column.title.toLowerCase()}</p>
            <button
              onClick={() => onAddJobToColumn(column.id)}
              className="mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Add Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
