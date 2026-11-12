import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  HelpCircle, 
  Timer, 
  FileText, 
  Layers, 
  BookOpen, 
  BookmarkCheck, 
  BarChart3, 
  Settings, 
  ShieldCheck,
  ChevronRight,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { dataService } from '../services/dataService';

export const Sidebar = ({ isOpen, onClose }) => {
  const stats = dataService.getStats();
  const profile = dataService.getProfile();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Practice PYQs', path: '/practice', icon: HelpCircle, badge: 'Popular' },
    { label: 'Mock Test Simulator', path: '/test', icon: Timer, badge: 'Timer' },
    { label: 'AKTU Exam Papers', path: '/papers', icon: FileText },
    { label: 'Semester Selection', path: '/semesters', icon: Layers },
    { label: 'Subject Syllabus', path: '/subjects', icon: BookOpen },
    { label: 'Bookmarks & Revision', path: '/bookmarks', icon: BookmarkCheck },
    { label: 'Progress Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Profile Settings', path: '/profile', icon: Settings },
    { label: 'Admin Portal', path: '/admin', icon: ShieldCheck, badge: 'Staff' }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-navy-900 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header on mobile sidebar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between md:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-navy-900 dark:text-white">AKTU PYQ HUB</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* User mini status */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-navy-950/30">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Enrolled Semester</span>
            <span className="font-semibold text-brand-600 dark:text-brand-400">Sem {profile.semester}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
            <span>Overall Accuracy</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{stats.accuracy}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-brand-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
            />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-500 dark:group-hover:text-brand-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : item.badge === 'Timer' 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' 
                            : 'bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="p-3 m-3 rounded-xl border border-brand-200/80 dark:border-brand-900/60 bg-gradient-to-br from-brand-50/70 to-indigo-50/40 dark:from-navy-950 dark:to-brand-950/30">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-900 dark:text-brand-200 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Target AKTU 2025</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
            Consistent PYQ practice increases end-semester scores by over 35%.
          </p>
        </div>

      </aside>
    </>
  );
};
