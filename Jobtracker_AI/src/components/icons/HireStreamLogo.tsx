import React from 'react';

interface LogoProps {
  className?: string;
}

export const HireStreamLogo: React.FC<LogoProps> = ({ className = 'w-7 h-7' }) => {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="hsGradient1"
          x1="2"
          y1="2"
          x2="38"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6366F1" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient
          id="hsGradient2"
          x1="10"
          y1="8"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#38BDF8" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
        <filter
          id="hsGlow"
          x="0"
          y="0"
          width="40"
          height="40"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="1.5" result="effect1_foregroundBlur" />
        </filter>
      </defs>

      {/* Outer Hexagon / Shield Frame */}
      <rect
        x="3"
        y="3"
        width="34"
        height="34"
        rx="10"
        fill="url(#hsGradient1)"
        fillOpacity="0.15"
        stroke="url(#hsGradient1)"
        strokeWidth="1.5"
      />

      {/* Stream Flow Waves & Node Connections */}
      <path
        d="M10 20C13 14 17 14 20 20C23 26 27 26 30 20"
        stroke="url(#hsGradient1)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M10 26C13 20 17 20 20 26C23 32 27 32 30 26"
        stroke="url(#hsGradient2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />

      {/* Briefcase Handle / Crest Node */}
      <path
        d="M16 13C16 11.3431 17.3431 10 19 10H21C22.6569 10 24 11.3431 24 13V14H16V13Z"
        fill="url(#hsGradient1)"
      />

      {/* Talent Node Pulsing Core */}
      <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
      <circle cx="20" cy="20" r="1.5" fill="#6366F1" />
      <circle cx="30" cy="20" r="2" fill="#38BDF8" />
      <circle cx="10" cy="20" r="2" fill="#EC4899" />
    </svg>
  );
};
