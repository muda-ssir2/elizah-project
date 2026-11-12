import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Save, 
  RotateCcw, 
  Moon, 
  Sun, 
  CheckCircle2, 
  Database, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { useTheme } from '../context/ThemeContext';
import { isSupabaseConfigured } from '../lib/supabase';

export const ProfilePage = () => {
  const currentProfile = dataService.getProfile();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: currentProfile.name || '',
    email: currentProfile.email || '',
    semester: currentProfile.semester || 5,
    branch: currentProfile.branch || 'Computer Science & Engineering',
    college: currentProfile.college || 'AKTU Affiliated Institute',
    targetExamYear: currentProfile.targetExamYear || '2025 Even Sem'
  });

  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dataService.updateProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm("This will reset all your question answers, mock test history, and custom questions back to original factory demo data. Proceed?")) {
      dataService.resetAllData();
      alert("Application data reset to default successfully!");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          <Settings className="w-3.5 h-3.5" />
          <span>Student Account Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
          Profile & Practice Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Customize your default semester, engineering branch, and examination target.
        </p>
      </div>

      {isSavedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs font-semibold text-emerald-800 dark:text-emerald-300 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {/* Main Profile Form Card */}
      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-md shadow-brand-500/20">
            {formData.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-900 dark:text-white">
              {formData.name || 'AKTU Student'}
            </h3>
            <p className="text-xs text-slate-500">
              Semester {formData.semester} • {formData.branch}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Active Enrolled Semester
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Branch / Discipline
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              AKTU Affiliated College
            </label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Target Examination Cycle
            </label>
            <input
              type="text"
              name="targetExamYear"
              value={formData.targetExamYear}
              onChange={handleChange}
              placeholder="e.g. 2025 Even Sem"
              className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 inline-flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>

      {/* Database & Theme Info Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-navy-900 dark:text-white">
          System & Storage Preferences
        </h3>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-navy-900 dark:text-white">Theme Display Mode</div>
            <div className="text-[11px] text-slate-500">Currently in {theme} mode</div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Toggle {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold text-navy-900 dark:text-white">Database Synchronization</div>
            <div className="text-[11px] text-slate-500">
              {isSupabaseConfigured ? 'Connected to live Supabase PostgreSQL' : 'Active on Local Browser Storage Engine'}
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
            isSupabaseConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isSupabaseConfigured ? 'Cloud Live' : 'Local Demo'}
          </span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetData}
            className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset all practice data back to initial seed defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
