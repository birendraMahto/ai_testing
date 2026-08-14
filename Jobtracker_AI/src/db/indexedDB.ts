import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Job, LinkedInProfile, ResumeItem } from '../types/job';
import { DEFAULT_RESUMES } from '../types/job';
import { INITIAL_NEW_OPENINGS, DEFAULT_LINKEDIN_PROFILE } from '../services/linkedinService';

interface JobTrackerDBSchema extends DBSchema {
  jobs: {
    key: string;
    value: Job;
    indexes: {
      'by-status': string;
      'by-dateApplied': string;
      'by-company': string;
    };
  };
  resumes: {
    key: string;
    value: ResumeItem;
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'JobTrackerDB';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<JobTrackerDBSchema>> | null = null;

export const initDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<JobTrackerDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1 || !db.objectStoreNames.contains('jobs')) {
          const jobStore = db.createObjectStore('jobs', { keyPath: 'id' });
          jobStore.createIndex('by-status', 'status');
          jobStore.createIndex('by-dateApplied', 'dateApplied');
          jobStore.createIndex('by-company', 'company');
        }
        if (!db.objectStoreNames.contains('resumes')) {
          db.createObjectStore('resumes', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
};

export const seedSampleDataIfEmpty = async (): Promise<Job[]> => {
  const db = await initDB();
  const count = await db.count('jobs');
  if (count === 0) {
    const todayStr = new Date().toISOString().split('T')[0];
    const threeDaysAgoStr = new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0];
    const fiveDaysAgoStr = new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0];
    const tenDaysAgoStr = new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0];

    const sampleJobs: Job[] = [
      ...INITIAL_NEW_OPENINGS,
      {
        id: 'sample-1',
        company: 'Stripe',
        title: 'Senior Frontend Engineer',
        linkedinUrl: 'https://www.linkedin.com/jobs/view/1234567890',
        resumeUsed: 'FullStack_Engineer_2026',
        dateApplied: todayStr,
        salaryRange: '$180,000 - $210,000',
        easyApply: 'Yes',
        notes: 'Referred by Alex from Product team. Hiring manager: Sarah M.',
        status: 'interview',
        location: 'San Francisco, CA (Hybrid)',
        jobPostedDate: '2 days ago',
        createdAt: Date.now() - 1000,
        updatedAt: Date.now() - 1000,
        order: 0,
      },
      {
        id: 'sample-2',
        company: 'Vercel',
        title: 'Staff UI Engineer',
        linkedinUrl: 'https://www.linkedin.com/jobs/view/2345678901',
        resumeUsed: 'Frontend_Lead_Resume',
        dateApplied: threeDaysAgoStr,
        salaryRange: '$190,000 - $230,000',
        easyApply: 'No',
        notes: 'Completed system design interview. Waiting for final round schedule.',
        status: 'interview',
        location: 'Remote (US)',
        jobPostedDate: '1 week ago',
        createdAt: Date.now() - 2000,
        updatedAt: Date.now() - 2000,
        order: 1,
      },
      {
        id: 'sample-3',
        company: 'Linear',
        title: 'Product Engineer (React/TypeScript)',
        linkedinUrl: 'https://www.linkedin.com/jobs/view/3456789012',
        resumeUsed: 'Product_Engineer_CV',
        dateApplied: todayStr,
        salaryRange: '₹35 - ₹45 LPA',
        easyApply: 'Yes',
        notes: 'Clean app design culture. Sent follow up message to Head of Engineering on LinkedIn.',
        status: 'applied',
        location: 'Remote',
        jobPostedDate: 'Yesterday',
        createdAt: Date.now() - 3000,
        updatedAt: Date.now() - 3000,
        order: 0,
      },
      {
        id: 'sample-4',
        company: 'OpenAI',
        title: 'Full Stack Member of Technical Staff',
        linkedinUrl: 'https://www.linkedin.com/jobs/view/4567890123',
        resumeUsed: 'FullStack_Engineer_2026',
        dateApplied: fiveDaysAgoStr,
        salaryRange: '$220,000 - $280,000',
        easyApply: 'No',
        notes: 'Followed up with recruiter after tech assessment.',
        status: 'followup',
        location: 'San Francisco, CA',
        jobPostedDate: '3 days ago',
        createdAt: Date.now() - 4000,
        updatedAt: Date.now() - 4000,
        order: 0,
      },
      {
        id: 'sample-5',
        company: 'Figma',
        title: 'Senior Software Engineer - Systems',
        linkedinUrl: 'https://www.linkedin.com/jobs/view/5678901234',
        resumeUsed: 'SDE_Resume_v3',
        dateApplied: todayStr,
        salaryRange: '$175,000 - $205,000',
        easyApply: 'Yes',
        notes: 'Saved for weekend application.',
        status: 'wishlist',
        location: 'New York, NY',
        jobPostedDate: '4 days ago',
        createdAt: Date.now() - 5000,
        updatedAt: Date.now() - 5000,
        order: 0,
      },
      {
        id: 'sample-6',
        company: 'Notion',
        title: 'Senior Frontend Developer',
        linkedinUrl: 'https://www.linkedin.com/jobs/view/6789012345',
        resumeUsed: 'Frontend_Lead_Resume',
        dateApplied: tenDaysAgoStr,
        salaryRange: '$160,000 - $190,000',
        easyApply: 'Yes',
        notes: 'Received written offer! Base $175k + Equity.',
        status: 'offer',
        location: 'San Francisco, CA (Remote)',
        jobPostedDate: '2 weeks ago',
        createdAt: Date.now() - 6000,
        updatedAt: Date.now() - 6000,
        order: 0,
      },
    ];

    const tx = db.transaction('jobs', 'readwrite');
    for (const job of sampleJobs) {
      await tx.store.put(job);
    }
    await tx.done;

    // Seed default resumes
    const resTx = db.transaction('resumes', 'readwrite');
    for (const rName of DEFAULT_RESUMES) {
      await resTx.store.put({
        id: rName,
        name: rName,
        fileName: `${rName}.pdf`,
        fileType: 'application/pdf',
        contentPreview: `Resume Content for ${rName}. Includes Experience, Tech Stack (React, TS, Node, AI), Education, and Key Achievements.`,
        updatedAt: Date.now(),
      });
    }
    await resTx.done;

    // Save default LinkedIn profile settings
    const setTx = db.transaction('settings', 'readwrite');
    await setTx.store.put(DEFAULT_LINKEDIN_PROFILE, 'linkedin_profile');
    await setTx.done;

    return sampleJobs;
  }

  return await getAllJobs();
};

export const getAllJobs = async (): Promise<Job[]> => {
  const db = await initDB();
  return await db.getAll('jobs');
};

export const addJob = async (job: Job): Promise<Job> => {
  const db = await initDB();
  await db.put('jobs', job);
  return job;
};

export const updateJob = async (job: Job): Promise<Job> => {
  const db = await initDB();
  await db.put('jobs', { ...job, updatedAt: Date.now() });
  return job;
};

export const updateJobsBatch = async (jobs: Job[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('jobs', 'readwrite');
  for (const job of jobs) {
    await tx.store.put(job);
  }
  await tx.done;
};

export const deleteJob = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('jobs', id);
};

export const bulkImportJobs = async (jobs: Job[]): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction('jobs', 'readwrite');
  await tx.store.clear();
  for (const job of jobs) {
    await tx.store.put(job);
  }
  await tx.done;
};

export const getAllResumeItems = async (): Promise<ResumeItem[]> => {
  const db = await initDB();
  const items = await db.getAll('resumes');
  if (items.length === 0) {
    // If empty, return defaults mapped
    return DEFAULT_RESUMES.map((rName) => ({
      id: rName,
      name: rName,
      fileName: `${rName}.pdf`,
      fileType: 'application/pdf',
      contentPreview: `Resume Content for ${rName}.`,
      updatedAt: Date.now(),
    }));
  }
  return items;
};

export const getAllResumes = async (): Promise<string[]> => {
  const items = await getAllResumeItems();
  return items.map((i) => i.name);
};

export const saveResumeItem = async (item: ResumeItem): Promise<void> => {
  const db = await initDB();
  await db.put('resumes', item);
};

export const saveCustomResume = async (name: string): Promise<void> => {
  if (!name.trim()) return;
  const db = await initDB();
  await db.put('resumes', {
    id: name.trim(),
    name: name.trim(),
    fileName: `${name.trim()}.pdf`,
    fileType: 'application/pdf',
    contentPreview: `Resume Version: ${name.trim()}`,
    updatedAt: Date.now(),
  });
};

export const deleteResumeItem = async (id: string): Promise<void> => {
  const db = await initDB();
  await db.delete('resumes', id);
};

export const getLinkedInProfileSettings = async (): Promise<LinkedInProfile> => {
  const db = await initDB();
  const saved = await db.get('settings', 'linkedin_profile');
  return saved || DEFAULT_LINKEDIN_PROFILE;
};

export const saveLinkedInProfileSettings = async (profile: LinkedInProfile): Promise<void> => {
  const db = await initDB();
  await db.put('settings', profile, 'linkedin_profile');
};
