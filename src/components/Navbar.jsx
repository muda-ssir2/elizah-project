import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  GraduationCap, 
  Search, 
  Bookmark, 
  Award, 
  ShieldCheck, 
  User, 
  Database, 
  Menu, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { isSupabaseConfigured } from '../lib/supabase';
import { dataService } from '../services/dataService';

export const Navbar = ({ onOpenMobileMenu }) => {
  const profile = dataService.getProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/subjects?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-navy-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Mobile Toggle & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenMobileMenu}
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-navy-900 dark:text-white">AKTU</span>
                  <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">PYQ HUB</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-600 dark:text-slate-300">BTech Exam Suite</span>
              </div>
            </Link>
          </div>

          {/* Center: Search & Quick Semester Pill */}
          <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject, code (e.g. BCS501, DBMS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              />
            </form>

            <Link
              to="/semesters"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 whitespace-nowrap transition-colors"
            >
              <span>Sem {profile.semester}</span>
              <ChevronDown className="w-3 h-3 text-brand-500" />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Database indicator */}
            <div 
              title={isSupabaseConfigured ? "Connected to Supabase PostgreSQL" : "Local Mock Engine Active (Connect Supabase anytime in .env)"}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isSupabaseConfigured ? 'Supabase Active' : 'Local Storage Mode'}</span>
            </div>

            <ThemeToggle />

            {/* Bookmarks Quick Link */}
            <Link
              to="/bookmarks"
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
              title="Saved Questions & Revision"
            >
              <Bookmark className="w-4 h-4" />
            </Link>

            {/* Admin Dashboard */}
            <Link
              to="/admin"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span>Admin</span>
            </Link>

            {/* Profile Avatar / Settings Link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-500/50 bg-slate-50 dark:bg-navy-900 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <span className="hidden sm:inline text-xs font-medium text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                {profile.name.split(' ')[0]}
              </span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};
