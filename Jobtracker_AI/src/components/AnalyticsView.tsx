import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Briefcase,
  XCircle,
  Clock,
  Award,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  MapPin,
  Sparkles,
  Layers,
  Circle,
} from 'lucide-react';
import type { Job, JobStatus } from '../types/job';
import { KANBAN_COLUMNS } from '../types/job';

interface AnalyticsViewProps {
  jobs: Job[];
}

export type ChartType = 'bar' | 'pie' | 'donut' | 'funnel';

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ jobs }) => {
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('donut');

  const stats = useMemo(() => {
    const totalJobs = jobs.filter((j) => !j.isDismissed).length;
    const newOpeningsCount = jobs.filter((j) => j.status === 'new_openings' && !j.isDismissed).length;
    const wishlistCount = jobs.filter((j) => j.status === 'wishlist' && !j.isDismissed).length;
    const appliedCount = jobs.filter((j) => j.status === 'applied' && !j.isDismissed).length;
    const followupCount = jobs.filter((j) => j.status === 'followup' && !j.isDismissed).length;
    const interviewCount = jobs.filter((j) => j.status === 'interview' && !j.isDismissed).length;
    const offerCount = jobs.filter((j) => j.status === 'offer' && !j.isDismissed).length;
    const rejectedCount = jobs.filter((j) => j.status === 'rejected' && !j.isDismissed).length;

    const totalSubmitted = appliedCount + followupCount + interviewCount + offerCount + rejectedCount;
    const interviewRate = totalSubmitted > 0 ? Math.round(((interviewCount + offerCount) / totalSubmitted) * 100) : 0;
    const offerRate = (interviewCount + offerCount) > 0 ? Math.round((offerCount / (interviewCount + offerCount)) * 100) : 0;
    const rejectionRate = totalSubmitted > 0 ? Math.round((rejectedCount / totalSubmitted) * 100) : 0;

    // Status breakdown items with colors
    const columnData = KANBAN_COLUMNS.map((col) => {
      const count = jobs.filter((j) => j.status === col.id && !j.isDismissed).length;
      const percentage = totalJobs > 0 ? Math.round((count / totalJobs) * 100) : 0;
      return {
        id: col.id,
        title: col.title,
        count,
        percentage,
        color: col.color,
      };
    });

    // Resume Performance Grouping
    const resumeMap: { [key: string]: { total: number; interviews: number; offers: number } } = {};
    jobs.forEach((j) => {
      if (j.status === 'new_openings' || j.isDismissed) return;
      const resName = j.resumeUsed || 'Unspecified';
      if (!resumeMap[resName]) {
        resumeMap[resName] = { total: 0, interviews: 0, offers: 0 };
      }
      resumeMap[resName].total += 1;
      if (j.status === 'interview') resumeMap[resName].interviews += 1;
      if (j.status === 'offer') resumeMap[resName].offers += 1;
    });

    const resumeStats = Object.entries(resumeMap).map(([name, data]) => ({
      name,
      total: data.total,
      interviews: data.interviews,
      offers: data.offers,
      successRate: data.total > 0 ? Math.round(((data.interviews + data.offers) / data.total) * 100) : 0,
    }));

    // Location Grouping
    const locationMap: { [key: string]: number } = {};
    jobs.forEach((j) => {
      if (j.isDismissed) return;
      const loc = j.location || 'Unspecified Location';
      locationMap[loc] = (locationMap[loc] || 0) + 1;
    });

    const locationStats = Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      totalJobs,
      newOpeningsCount,
      wishlistCount,
      appliedCount,
      followupCount,
      interviewCount,
      offerCount,
      rejectedCount,
      totalSubmitted,
      interviewRate,
      offerRate,
      rejectionRate,
      columnData,
      resumeStats,
      locationStats,
    };
  }, [jobs]);

  // Color mapping hex values for SVG Pie/Donut charts
  const statusColorHexMap: Record<JobStatus, string> = {
    new_openings: '#0284c7', // Sky-600
    wishlist: '#64748b',     // Slate-500
    applied: '#2563eb',      // Blue-600
    followup: '#d97706',     // Amber-600
    interview: '#9333ea',    // Purple-600
    offer: '#059669',        // Emerald-600
    rejected: '#e11d48',     // Rose-600
  };

  // Compute SVG Slices for Pie & Donut charts
  const pieSlices = useMemo(() => {
    const total = stats.totalJobs || 1;
    let accumulatedAngle = 0;

    return stats.columnData.map((item) => {
      const sliceAngle = (item.count / total) * 360;
      const startAngle = accumulatedAngle;
      const endAngle = accumulatedAngle + sliceAngle;
      accumulatedAngle += sliceAngle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const radius = 100;
      const cx = 120;
      const cy = 120;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = sliceAngle > 180 ? 1 : 0;

      const pathData =
        sliceAngle >= 359.9
          ? `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx - radius} ${cy}`
          : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return {
        ...item,
        pathData,
        fill: statusColorHexMap[item.id],
      };
    });
  }, [stats.columnData, stats.totalJobs]);

  const maxCount = Math.max(...stats.columnData.map((c) => c.count), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold">Job Application Analytics Dashboard</h2>
          </div>
          <p className="text-xs text-indigo-200">
            Real-time pipeline metrics, multi-chart visualization, and resume conversion benchmarks
          </p>
        </div>

        <div className="flex items-center gap-4 text-center">
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-2xl font-extrabold text-amber-400">{stats.interviewRate}%</p>
            <p className="text-[11px] text-indigo-200">Interview Rate</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
            <p className="text-2xl font-extrabold text-emerald-400">{stats.offerCount}</p>
            <p className="text-[11px] text-indigo-200">Offers Received</p>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tracked</span>
            <Briefcase className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalJobs}</p>
          <span className="text-[11px] text-slate-400">All status cards</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Openings</span>
            <Sparkles className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{stats.newOpeningsCount}</p>
          <span className="text-[11px] text-slate-400">LinkedIn matched</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Submitted</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSubmitted}</p>
          <span className="text-[11px] text-slate-400">Active applications</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Interviews</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.interviewCount}</p>
          <span className="text-[11px] text-slate-400">In active rounds</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Offers</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.offerCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">
            {stats.offerRate}% conversion
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rejections</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.rejectedCount}</p>
          <span className="text-[11px] text-slate-400">{stats.rejectionRate}% rate</span>
        </div>
      </div>

      {/* Main Charts & Visualizations Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Multi-Chart Viewer Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div>
            {/* Chart Type Selector Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Application Status Distribution
                </h3>
              </div>

              {/* Chart Option Toggle Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setSelectedChartType('donut')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedChartType === 'donut'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Donut Chart"
                >
                  <Circle className="w-3.5 h-3.5" />
                  Donut
                </button>

                <button
                  onClick={() => setSelectedChartType('pie')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedChartType === 'pie'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Pie Chart"
                >
                  <PieChartIcon className="w-3.5 h-3.5" />
                  Pie
                </button>

                <button
                  onClick={() => setSelectedChartType('bar')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedChartType === 'bar'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Bar Graph"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Bar
                </button>

                <button
                  onClick={() => setSelectedChartType('funnel')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                    selectedChartType === 'funnel'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Funnel Progression"
                >
                  <Layers className="w-3.5 h-3.5" />
                  Funnel
                </button>
              </div>
            </div>

            {/* CHART RENDER AREA */}
            <div className="py-2 flex flex-col items-center justify-center min-h-[300px]">
              {/* Option 1: DONUT & PIE CHARTS */}
              {(selectedChartType === 'donut' || selectedChartType === 'pie') && (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
                  <div className="relative w-60 h-60 shrink-0">
                    <svg viewBox="0 0 240 240" className="w-full h-full drop-shadow-md">
                      {pieSlices.map((slice) =>
                        slice.count > 0 ? (
                          <path
                            key={slice.id}
                            d={slice.pathData}
                            fill={slice.fill}
                            className="transition-all duration-300 hover:opacity-85 hover:scale-105 transform origin-center cursor-pointer"
                          />
                        ) : null
                      )}
                      {/* Donut inner hole cutoff */}
                      {selectedChartType === 'donut' && (
                        <>
                          <circle cx="120" cy="120" r="62" className="fill-white dark:fill-slate-800" />
                          <text
                            x="120"
                            y="112"
                            textAnchor="middle"
                            className="fill-slate-900 dark:fill-white font-extrabold text-2xl"
                          >
                            {stats.totalJobs}
                          </text>
                          <text
                            x="120"
                            y="132"
                            textAnchor="middle"
                            className="fill-slate-400 font-medium text-[10px]"
                          >
                            Total Jobs
                          </text>
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Legend Table */}
                  <div className="flex-1 space-y-2 w-full">
                    {stats.columnData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/40 transition"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${item.color.dot}`} />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 dark:text-white">{item.count}</span>
                          <span className="w-10 text-right text-slate-400 font-medium">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Option 2: BAR GRAPH */}
              {selectedChartType === 'bar' && (
                <div className="w-full space-y-3.5 py-2">
                  {stats.columnData.map((item) => {
                    const barWidth = Math.max(Math.round((item.count / maxCount) * 100), 4);
                    return (
                      <div key={item.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color.dot}`} />
                            <span className="text-slate-800 dark:text-slate-200">{item.title}</span>
                          </div>
                          <span className="text-slate-900 dark:text-white">
                            {item.count} <span className="text-slate-400 font-normal">({item.percentage}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 dark:bg-slate-700/60 rounded-lg overflow-hidden p-0.5">
                          <div
                            className={`h-full rounded-md transition-all duration-500 ${item.color.dot}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Option 3: FUNNEL PROGRESSION */}
              {selectedChartType === 'funnel' && (
                <div className="w-full space-y-2 py-2">
                  {stats.columnData.map((item, idx) => {
                    const widthPercent = Math.max(100 - idx * 12, 30);
                    return (
                      <div key={item.id} className="flex flex-col items-center">
                        <div
                          className={`py-2 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-between shadow-xs transition-all duration-300 ${item.color.dot}`}
                          style={{ width: `${widthPercent}%` }}
                        >
                          <span className="truncate">{item.title}</span>
                          <span className="font-bold">{item.count} jobs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resume Benchmark & Conversion */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Resume Conversion Benchmark
                </h3>
              </div>
              <span className="text-xs text-slate-400">Interviews per Resume</span>
            </div>

            <div className="space-y-3.5">
              {stats.resumeStats.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-6 text-center">
                  No submitted jobs tracked with resume tags yet.
                </p>
              ) : (
                stats.resumeStats.map((res) => (
                  <div
                    key={res.name}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                          {res.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {res.total} applications • {res.interviews} interviews • {res.offers} offers
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                        {res.successRate}% Success
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Location Distribution */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/80">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Top Target Locations
            </h4>
            <div className="flex flex-wrap gap-2">
              {stats.locationStats.map(([loc, count]) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600/60"
                >
                  {loc} <span className="font-bold text-indigo-600 dark:text-indigo-400">({count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
