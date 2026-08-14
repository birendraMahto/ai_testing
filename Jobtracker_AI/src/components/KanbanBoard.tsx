import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Job, JobStatus } from '../types/job';
import { KANBAN_COLUMNS } from '../types/job';
import { KanbanColumn } from './KanbanColumn';
import { JobCard } from './JobCard';

interface KanbanBoardProps {
  jobs: Job[];
  onJobsChange: (updatedJobs: Job[]) => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onAddJobToColumn: (status: JobStatus) => void;
  onMoveJobStatus: (job: Job, newStatus: JobStatus) => void;
  onDismissJob: (id: string) => void;
  locationFilter: string;
  onLocationFilterChange: (loc: string) => void;
  limitFilter: number;
  onLimitFilterChange: (limit: number) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  jobs,
  onJobsChange,
  onEditJob,
  onDeleteJob,
  onAddJobToColumn,
  onMoveJobStatus,
  onDismissJob,
  locationFilter,
  onLocationFilterChange,
  limitFilter,
  onLimitFilterChange,
}) => {
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateScrollState = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < maxScroll - 5);
    } else {
      setCanScrollLeft(false);
      setCanScrollRight(false);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0 && !e.shiftKey) {
        const isScrollableVertical = (e.target as HTMLElement)?.closest('.custom-scrollbar');
        if (!isScrollableVertical) {
          el.scrollLeft += e.deltaY;
        }
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleScrollStep = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const step = 350;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -step : step,
      behavior: 'smooth',
    });
  };

  const findJob = (id: string): Job | undefined => jobs.find((j) => j.id === id);

  const findColumnStatus = (id: string): JobStatus | null => {
    if (KANBAN_COLUMNS.some((col) => col.id === id)) {
      return id as JobStatus;
    }
    const targetJob = findJob(id);
    return targetJob ? targetJob.status : null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const job = findJob(active.id as string);
    if (job) {
      setActiveJob(job);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeStatus = findColumnStatus(activeId);
    const overStatus = findColumnStatus(overId);

    if (!activeStatus || !overStatus || activeStatus === overStatus) {
      return;
    }

    const updatedJobs = jobs.map((job) => {
      if (job.id === activeId) {
        return {
          ...job,
          status: overStatus,
          updatedAt: Date.now(),
        };
      }
      return job;
    });

    onJobsChange(updatedJobs);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeJobObj = findJob(activeId);
    if (!activeJobObj) return;

    const overStatus = findColumnStatus(overId);

    if (overStatus && activeJobObj.status !== overStatus) {
      const updatedJobs = jobs.map((job) =>
        job.id === activeId ? { ...job, status: overStatus, updatedAt: Date.now() } : job
      );
      onJobsChange(updatedJobs);
      return;
    }

    if (activeId !== overId) {
      const activeIndex = jobs.findIndex((j) => j.id === activeId);
      const overIndex = jobs.findIndex((j) => j.id === overId);

      if (activeIndex !== -1 && overIndex !== -1) {
        const reordered = arrayMove(jobs, activeIndex, overIndex).map((job, index) => ({
          ...job,
          order: index,
        }));
        onJobsChange(reordered);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex flex-col min-h-0 relative">
        {/* Sleek Floating Board Scroll Controls */}
        <div className="absolute top-3 right-6 z-20 hidden md:flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 dark:border-slate-800/90 shadow-md">
          <button
            onClick={() => handleScrollStep('left')}
            disabled={!canScrollLeft}
            className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Scroll Board
          </span>
          <button
            onClick={() => handleScrollStep('right')}
            disabled={!canScrollRight}
            className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* HORIZONTAL SCROLLABLE KANBAN BOARD CONTAINER */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto p-4 sm:p-6 custom-scrollbar-x select-none"
        >
          <div className="flex items-start gap-4 sm:gap-5 pb-6 min-w-max">
            {KANBAN_COLUMNS.map((column) => {
              let columnJobs = jobs.filter((j) => j.status === column.id && !j.isDismissed);

              if (column.id === 'new_openings') {
                if (locationFilter && locationFilter !== 'All Locations') {
                  columnJobs = columnJobs.filter(
                    (j) => j.location && j.location.toLowerCase().includes(locationFilter.toLowerCase())
                  );
                }
                if (limitFilter && limitFilter < 900) {
                  columnJobs = columnJobs.slice(0, limitFilter);
                }
              }

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  jobs={columnJobs}
                  onEditJob={onEditJob}
                  onDeleteJob={onDeleteJob}
                  onAddJobToColumn={onAddJobToColumn}
                  onMoveJobStatus={onMoveJobStatus}
                  onDismissJob={onDismissJob}
                  locationFilter={locationFilter}
                  onLocationFilterChange={onLocationFilterChange}
                  limitFilter={limitFilter}
                  onLimitFilterChange={onLimitFilterChange}
                />
              );
            })}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeJob ? (
          <JobCard
            job={activeJob}
            onEdit={() => {}}
            onDelete={() => {}}
            isOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
