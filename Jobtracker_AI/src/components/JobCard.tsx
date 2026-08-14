import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Pencil,
  Trash2,
  MapPin,
  DollarSign,
  FileText,
  Calendar,
  Zap,
  ChevronLeft,
  ChevronRight,
  Clock,
  ArchiveX,
} from 'lucide-react';
import type { Job, JobStatus } from '../types/job';
import { KANBAN_COLUMNS } from '../types/job';
import { LinkedinIcon } from './icons/LinkedinIcon';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onMoveStatus?: (job: Job, newStatus: JobStatus) => void;
  onDismiss?: (id: string) => void;
  isOverlay?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onEdit,
  onDelete,
  onMoveStatus,
  onDismiss,
  isOverlay = false,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const currentColumnIndex = KANBAN_COLUMNS.findIndex((col) => col.id === job.status);
  const prevColumn = currentColumnIndex > 0 ? KANBAN_COLUMNS[currentColumnIndex - 1] : null;
  const nextColumn =
    currentColumnIndex < KANBAN_COLUMNS.length - 1
      ? KANBAN_COLUMNS[currentColumnIndex + 1]
      : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 p-3.5 shadow-xs hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-40 ring-2 ring-indigo-500 shadow-xl' : ''
      } ${isOverlay ? 'shadow-2xl ring-2 ring-indigo-500 rotate-1 cursor-grabbing' : ''}`}
    >
      {/* Top Header Row: Company, Drag Handle, & Actions */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 shrink-0 p-0.5"
            title="Drag to reorder or move column"
          >
            <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <span className="w-1 h-1 bg-current rounded-full"></span>
            </div>
          </div>

          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
            {job.company}
          </h3>
        </div>

        {/* Distinct Card Action Icons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition shrink-0">
          {job.linkedinUrl && (
            <a
              href={job.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition"
              title="Open LinkedIn Job URL"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Edit Job */}
          <button
            onClick={() => onEdit(job)}
            className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition"
            title="Edit job details"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>

          {/* Dismiss Listing Icon */}
          {onDismiss && (
            <button
              onClick={() => onDismiss(job.id)}
              className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded transition"
              title="Dismiss job card from board"
            >
              <ArchiveX className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Card Permanently */}
          <button
            onClick={() => onDelete(job.id)}
            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition"
            title="Delete card permanently"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Job Title / Role */}
      <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-2 line-clamp-2 leading-snug">
        {job.title}
      </h4>

      {/* Location & Salary Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
        {job.location && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate max-w-[140px]">{job.location}</span>
          </span>
        )}

        {job.salaryRange && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
            <DollarSign className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{job.salaryRange}</span>
          </span>
        )}
      </div>

      {/* Meta Tags: Resume Used, Date Applied, Easy Apply */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        {job.resumeUsed && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="truncate max-w-[120px]">{job.resumeUsed}</span>
          </span>
        )}

        {job.dateApplied && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            <Calendar className="w-3 h-3 text-blue-500 shrink-0" />
            <span>{job.dateApplied}</span>
          </span>
        )}

        {job.jobPostedDate && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] text-slate-400 font-normal">
            <Clock className="w-3 h-3" />
            <span>{job.jobPostedDate}</span>
          </span>
        )}
      </div>

      {/* Easy Apply Badge */}
      {job.easyApply === 'Yes' && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300/80 dark:border-amber-800">
            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
            Easy Apply
          </span>
        </div>
      )}

      {/* Notes / Recruiter Info */}
      {job.notes && (
        <div className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 italic">
          "{job.notes}"
        </div>
      )}

      {/* Column Shift Quick Controls */}
      {onMoveStatus && !isOverlay && (
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="text-[10px] font-medium text-slate-400">Move column:</span>
          <div className="flex items-center gap-1">
            {prevColumn && (
              <button
                onClick={() => onMoveStatus(job, prevColumn.id)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition"
                title={`Move to ${prevColumn.title}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            {nextColumn && (
              <button
                onClick={() => onMoveStatus(job, nextColumn.id)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition"
                title={`Move to ${nextColumn.title}`}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
