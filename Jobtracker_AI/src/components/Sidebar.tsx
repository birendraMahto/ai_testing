import React, { useState, useRef, useCallback } from 'react';
import {
  Plus,
  FolderArchive,
  Download,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  onOpenAddModal: () => void;
  onOpenResumeBox: () => void;
  onOpenImportExport: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenAddModal,
  onOpenResumeBox,
  onOpenImportExport,
  darkMode,
  onToggleDarkMode,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const isResizingRef = useRef(false);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopResizing);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;
    const newWidth = e.clientX;
    if (newWidth >= 180 && newWidth <= 380) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const stopResizing = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopResizing);
  }, []);

  return (
    <aside
      style={{ width: isCollapsed ? 68 : sidebarWidth }}
      className="relative flex flex-col bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 transition-all duration-200 select-none shrink-0 z-20 shadow-xs"
    >
      {/* Sidebar Header & Collapse Toggle */}
      <div className="p-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-1">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quick Menu
            </span>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition mx-auto"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Actions List */}
      <div className="flex-1 py-4 px-2 space-y-2.5 overflow-y-auto custom-scrollbar">
        {/* Primary Add Job Button */}
        <button
          onClick={onOpenAddModal}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-600/20 active:scale-[0.98] transition ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Add New Job Card"
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Add Job Card</span>}
        </button>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1">
          {/* Resume Box */}
          <button
            onClick={onOpenResumeBox}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Resume Box Collection"
          >
            <FolderArchive className="w-4 h-4 text-indigo-500 shrink-0" />
            {!isCollapsed && <span>Resume Box</span>}
          </button>

          {/* Backup & Restore */}
          <button
            onClick={onOpenImportExport}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title="Backup & Restore Data"
          >
            <Download className="w-4 h-4 text-sky-500 shrink-0" />
            {!isCollapsed && <span>Backup & Restore</span>}
          </button>

          {/* Light Mode / Dark Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
            )}
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {darkMode ? 'ON' : 'OFF'}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Local Storage</span>
          <span className="font-semibold text-indigo-500">IndexedDB</span>
        </div>
      )}

      {/* Resizable Drag Handle on Right Border */}
      {!isCollapsed && (
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-indigo-500/40 active:bg-indigo-600 transition flex items-center justify-center group"
          title="Drag to resize sidebar width"
        >
          <GripVertical className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
        </div>
      )}
    </aside>
  );
};
