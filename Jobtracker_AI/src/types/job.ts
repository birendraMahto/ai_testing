export type JobStatus =
  | 'new_openings'
  | 'wishlist'
  | 'applied'
  | 'followup'
  | 'interview'
  | 'offer'
  | 'rejected';

export type EasyApplyOption = 'Yes' | 'No' | 'N/A';

export interface Job {
  id: string;
  company: string;
  title: string;
  linkedinUrl?: string;
  resumeUsed: string;
  dateApplied: string; // YYYY-MM-DD
  salaryRange?: string;
  easyApply: EasyApplyOption;
  notes?: string;
  status: JobStatus;
  location?: string;
  jobPostedDate?: string;
  createdAt: number;
  updatedAt: number;
  order: number;
  isDismissed?: boolean;
}

export interface LinkedInProfile {
  isConnected: boolean;
  name: string;
  headline: string;
  email?: string;
  avatarUrl?: string;
  preferredRoles: string[];
  preferredLocations: string[];
  connectedAt?: number;
}

export interface ResumeItem {
  id: string;
  name: string;
  fileName?: string;
  fileType?: string;
  fileData?: string; // Data URL or text content
  contentPreview?: string;
  updatedAt: number;
}

export interface ColumnDefinition {
  id: JobStatus;
  title: string;
  description: string;
  color: {
    border: string;
    badgeBg: string;
    badgeText: string;
    dot: string;
    headerBg: string;
  };
}

export const KANBAN_COLUMNS: ColumnDefinition[] = [
  {
    id: 'new_openings',
    title: 'New Openings',
    description: 'Latest jobs matching your LinkedIn profile',
    color: {
      border: 'border-l-sky-500 dark:border-l-sky-400',
      badgeBg: 'bg-sky-100 dark:bg-sky-950/70',
      badgeText: 'text-sky-700 dark:text-sky-300',
      dot: 'bg-sky-500',
      headerBg: 'bg-sky-500/10',
    },
  },
  {
    id: 'wishlist',
    title: 'Wishlist',
    description: 'Jobs saved for later application',
    color: {
      border: 'border-l-slate-400 dark:border-l-slate-500',
      badgeBg: 'bg-slate-100 dark:bg-slate-800',
      badgeText: 'text-slate-700 dark:text-slate-300',
      dot: 'bg-slate-400',
      headerBg: 'bg-slate-500/10',
    },
  },
  {
    id: 'applied',
    title: 'Applied',
    description: 'Application submitted',
    color: {
      border: 'border-l-blue-500',
      badgeBg: 'bg-blue-100 dark:bg-blue-950/60',
      badgeText: 'text-blue-700 dark:text-blue-300',
      dot: 'bg-blue-500',
      headerBg: 'bg-blue-500/10',
    },
  },
  {
    id: 'followup',
    title: 'Follow-up',
    description: 'Followed up with recruiter/referral',
    color: {
      border: 'border-l-amber-500',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60',
      badgeText: 'text-amber-700 dark:text-amber-300',
      dot: 'bg-amber-500',
      headerBg: 'bg-amber-500/10',
    },
  },
  {
    id: 'interview',
    title: 'Interview',
    description: 'Currently in interview rounds',
    color: {
      border: 'border-l-purple-500',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/60',
      badgeText: 'text-purple-700 dark:text-purple-300',
      dot: 'bg-purple-500',
      headerBg: 'bg-purple-500/10',
    },
  },
  {
    id: 'offer',
    title: 'Offer',
    description: 'Received job offer',
    color: {
      border: 'border-l-emerald-500',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      headerBg: 'bg-emerald-500/10',
    },
  },
  {
    id: 'rejected',
    title: 'Rejected',
    description: 'Application rejected',
    color: {
      border: 'border-l-rose-500',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/60',
      badgeText: 'text-rose-700 dark:text-rose-300',
      dot: 'bg-rose-500',
      headerBg: 'bg-rose-500/10',
    },
  },
];

export const DEFAULT_RESUMES = [
  'FullStack_Engineer_2026',
  'Frontend_Lead_Resume',
  'SDE_Resume_v3',
  'QA_Lead_Resume',
  'Product_Engineer_CV',
];
