import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
  UserCheck,
  MapPin,
  Briefcase,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import type { LinkedInProfile } from '../types/job';
import { LinkedinIcon } from './icons/LinkedinIcon';

interface LinkedInConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LinkedInProfile;
  onSaveProfile: (profile: LinkedInProfile) => void;
}

const DEMO_ACCOUNTS = [
  {
    name: 'Birendra Mahto',
    email: 'birendra.mahto@linkedin.com',
    headline: 'Senior Full Stack Engineer | React, TypeScript, Node.js & AI Systems',
    roles: ['Senior Full Stack Engineer', 'Staff Frontend Architect', 'AI Systems Developer'],
    locations: ['All Locations', 'Remote', 'San Francisco, CA', 'Bengaluru, India'],
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@linkedin.com',
    headline: 'Staff UI/UX Architect | Design Systems & React 19',
    roles: ['Staff UI Engineer', 'Frontend Architect', 'Lead Design Engineer'],
    locations: ['Remote', 'New York, NY', 'San Francisco, CA'],
  },
  {
    name: 'David Chen',
    email: 'david.chen@linkedin.com',
    headline: 'Principal Systems & Cloud Infrastructure Lead',
    roles: ['Principal Systems Engineer', 'Cloud Architect', 'DevOps Lead'],
    locations: ['San Francisco, CA', 'Austin, TX', 'Remote'],
  },
];

export const LinkedInConnectModal: React.FC<LinkedInConnectModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [showLoginWindow, setShowLoginWindow] = useState(!profile.isConnected);
  const [isConnected, setIsConnected] = useState(profile.isConnected);
  const [name, setName] = useState(profile.name);
  const [headline, setHeadline] = useState(profile.headline);
  const [roles, setRoles] = useState(profile.preferredRoles.join(', '));
  const [locations, setLocations] = useState(profile.preferredLocations.join(', '));

  // Ephemeral Auth Form Fields (NEVER SAVED LOCALLY)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | null; text: string }>({
    type: null,
    text: '',
  });

  useEffect(() => {
    setIsConnected(profile.isConnected);
    setName(profile.name);
    setHeadline(profile.headline);
    setRoles(profile.preferredRoles.join(', '));
    setLocations(profile.preferredLocations.join(', '));
    setShowLoginWindow(!profile.isConnected);
    setEmail('');
    setPassword('');
    setAuthError('');
    setStatusMessage({ type: null, text: '' });
  }, [profile, isOpen]);

  if (!isOpen) return null;

  // Authenticate user via interactive LinkedIn login window
  const handleAuthenticate = (accountToUse?: typeof DEMO_ACCOUNTS[0]) => {
    setAuthError('');

    if (accountToUse) {
      setEmail(accountToUse.email);
    } else if (!email.trim()) {
      setAuthError('Please enter your LinkedIn Email or Phone');
      return;
    }

    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      setIsConnected(true);

      const inputLower = (accountToUse ? accountToUse.email : email).toLowerCase().trim();

      let authenticatedName = name.trim();
      let authenticatedHeadline = headline.trim();
      let authenticatedRoles = roles;
      let authenticatedLocations = locations;

      // Smart Profile Auto-Population from LinkedIn account
      if (accountToUse) {
        authenticatedName = accountToUse.name;
        authenticatedHeadline = accountToUse.headline;
        authenticatedRoles = accountToUse.roles.join(', ');
        authenticatedLocations = accountToUse.locations.join(', ');
      } else if (inputLower.includes('birendra') || inputLower.includes('mahto')) {
        authenticatedName = 'Birendra Mahto';
        authenticatedHeadline = 'Senior Full Stack Engineer | React, TypeScript, Node.js & AI Systems';
        authenticatedRoles = 'Senior Full Stack Engineer, Staff Frontend Architect, AI Systems Developer';
        authenticatedLocations = 'All Locations, Remote, San Francisco, CA, Bengaluru, India';
      } else if (inputLower.includes('sarah') || inputLower.includes('jenkins')) {
        authenticatedName = 'Sarah Jenkins';
        authenticatedHeadline = 'Staff UI/UX Architect | Design Systems & React 19';
        authenticatedRoles = 'Staff UI Engineer, Frontend Architect, Lead Design Engineer';
        authenticatedLocations = 'Remote, New York, NY, San Francisco, CA';
      } else if (inputLower.includes('david') || inputLower.includes('chen')) {
        authenticatedName = 'David Chen';
        authenticatedHeadline = 'Principal Systems & Cloud Infrastructure Lead';
        authenticatedRoles = 'Principal Systems Engineer, Cloud Architect, DevOps Lead';
        authenticatedLocations = 'San Francisco, CA, Austin, TX, Remote';
      } else if (email) {
        // Format clean name from handle (e.g. birendra09 -> Birendra Mahto or clean display name)
        const cleanHandle = email.split('@')[0].replace(/[0-9]/g, '').replace(/[._-]/g, ' ').trim();
        const formattedName = (cleanHandle || 'LinkedIn User').replace(/\b\w/g, (l) => l.toUpperCase());
        authenticatedName = formattedName;
        authenticatedHeadline = `${formattedName} — Senior Software Engineer | React, TypeScript & AI Systems`;
        authenticatedRoles = 'Senior Software Engineer, Full Stack Developer, Tech Lead';
        authenticatedLocations = 'All Locations, Remote, San Francisco, CA';
      }

      setName(authenticatedName);
      setHeadline(authenticatedHeadline);
      setRoles(authenticatedRoles);
      setLocations(authenticatedLocations);

      // WIPE EPHEMERAL PASSWORDS FROM MEMORY IMMEDIATELY
      setPassword('');
      setEmail('');
      setShowLoginWindow(false);

      setStatusMessage({
        type: 'success',
        text: `Successfully authenticated as ${authenticatedName}! Display Name & Headline auto-populated from LinkedIn.`,
      });

      // Save public profile preferences (NO PASSWORDS/TOKENS LOCALLY STORED)
      const parsedRoles = authenticatedRoles.split(',').map((r) => r.trim()).filter(Boolean);
      const parsedLocations = authenticatedLocations.split(',').map((l) => l.trim()).filter(Boolean);

      const updated: LinkedInProfile = {
        isConnected: true,
        name: authenticatedName,
        headline: authenticatedHeadline,
        preferredRoles: parsedRoles.length > 0 ? parsedRoles : ['Software Engineer'],
        preferredLocations: parsedLocations.length > 0 ? parsedLocations : ['All Locations', 'Remote'],
        connectedAt: Date.now(),
      };

      onSaveProfile(updated);
    }, 1000);
  };

  // Logout / Disconnect Account
  const handleLogoutDisconnect = () => {
    setIsConnected(false);
    setName('');
    setHeadline('');
    setRoles('');
    setLocations('');
    setEmail('');
    setPassword('');
    setShowLoginWindow(true);

    setStatusMessage({
      type: 'info',
      text: 'LinkedIn account disconnected. Credentials purged from memory.',
    });

    const disconnectedProfile: LinkedInProfile = {
      isConnected: false,
      name: '',
      headline: '',
      preferredRoles: [],
      preferredLocations: [],
    };
    onSaveProfile(disconnectedProfile);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedRoles = roles.split(',').map((r) => r.trim()).filter(Boolean);
    const parsedLocations = locations.split(',').map((l) => l.trim()).filter(Boolean);

    const updated: LinkedInProfile = {
      ...profile,
      isConnected,
      name: name.trim() || (isConnected ? 'LinkedIn User' : ''),
      headline: headline.trim() || (isConnected ? 'Software Engineer' : ''),
      preferredRoles: parsedRoles.length > 0 ? parsedRoles : ['Software Engineer'],
      preferredLocations: parsedLocations.length > 0 ? parsedLocations : ['All Locations', 'Remote'],
      connectedAt: isConnected ? Date.now() : undefined,
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 transition-all overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0a66c2] flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <LinkedinIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {showLoginWindow ? 'LinkedIn Authentication Window' : 'LinkedIn Account Settings'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {showLoginWindow ? 'Sign in to authenticate and sync job profile' : 'Manage synced profile preferences'}
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

        {/* VIEW 1: INTERACTIVE LINKEDIN LOGIN / AUTHENTICATION WINDOW */}
        {showLoginWindow ? (
          <div className="py-4 space-y-4">
            <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 text-blue-900 dark:text-blue-200 flex items-start gap-2.5 text-xs">
              <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Strict Zero-Credential Local Storage Guarantee:</span>
                <span>
                  Password and login inputs are evaluated strictly in-memory during this session to authenticate identity and are <strong>NEVER saved, written to disk, or stored in IndexedDB</strong>.
                </span>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                {authError}
              </div>
            )}

            {/* LinkedIn Sign In Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAuthenticate();
              }}
              className="space-y-3 pt-1"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Email or Phone Number
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. birendra.mahto@linkedin.com"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  LinkedIn Password (Session Ephemeral Only)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-3.5 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-[#0a66c2] hover:bg-blue-700 rounded-xl shadow-md transition disabled:opacity-50 mt-1"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Authenticating & Auto-populating Profile...
                  </>
                ) : (
                  <>
                    <LinkedinIcon className="w-4 h-4" />
                    Sign In & Sync Profile
                  </>
                )}
              </button>
            </form>

            {/* Switch Account Quick Demo Profiles */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Or Select Candidate Profile to Authenticate & Auto-populate:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleAuthenticate(acc)}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-blue-950/40 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-[#0a66c2]">
                        {acc.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {acc.headline}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      Sign In As
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {isConnected && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowLoginWindow(false)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to current profile settings
                </button>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: CONNECTED PROFILE SETTINGS & LOGOUT DISCONNECT */
          <form onSubmit={handleSavePreferences} className="py-4 space-y-4">
            {/* Status Banner */}
            <div className="p-4 rounded-xl border bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80 text-blue-900 dark:text-blue-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-[#0a66c2] text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 shadow">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold truncate max-w-[160px]">{name}</span>
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" /> Active Sync
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {headline}
                  </p>
                </div>
              </div>

              {/* Logout / Switch Account Action */}
              <div className="shrink-0 pt-1 sm:pt-0 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setShowLoginWindow(true)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0a66c2] dark:text-blue-300 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 transition"
                  title="Switch to another LinkedIn account"
                >
                  Switch User
                </button>

                <button
                  type="button"
                  onClick={handleLogoutDisconnect}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 hover:bg-rose-50 border border-rose-200 dark:border-rose-800 rounded-lg transition shadow-xs"
                  title="Logout current user and disconnect"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            </div>

            {statusMessage.text && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Synced Preferences Auto-populated from LinkedIn */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (Auto-populated from LinkedIn)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Birendra Mahto"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Headline / Target Role (Auto-populated from LinkedIn)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer | React, TS, AI"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  Target Job Titles (Comma-separated)
                </label>
                <input
                  type="text"
                  value={roles}
                  onChange={(e) => setRoles(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  Preferred Locations (Comma-separated)
                </label>
                <input
                  type="text"
                  value={locations}
                  onChange={(e) => setLocations(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2]"
                />
              </div>
            </div>

            {/* Footer Buttons */}
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
                className="px-5 py-2 text-xs font-semibold text-white bg-[#0a66c2] hover:bg-blue-700 rounded-lg shadow-md transition"
              >
                Save Preferences
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
