import React from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle, 
  Timer, 
  FileText, 
  BarChart3, 
  ShieldCheck, 
  Award,
  BookOpen,
  Zap,
  Target
} from 'lucide-react';
import { dataService } from '../services/dataService';

export const LandingPage = () => {
  const stats = dataService.getStats();
  const subjects = dataService.getSubjects();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 via-violet-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50/70 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Built specifically for Dr. A.P.J. Abdul Kalam Technical University (AKTU)</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 dark:text-white leading-[1.15] mb-6">
            Master AKTU BTech Exams with{' '}
            <span className="bg-gradient-to-r from-brand-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Targeted PYQ Practice
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
            Practice authenticated Previous Year Questions unit-by-unit, take full-length timed mock tests, and master 2-mark definitions & 10-mark numerical questions before the semester exams.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all hover:shadow-brand-500/40 hover:-translate-y-0.5"
            >
              <span>Go to Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/practice"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
            >
              <HelpCircle className="w-4 h-4 text-brand-500" />
              <span>Start Practicing Questions</span>
            </Link>
          </div>

          {/* Quick Trust Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Verified 2019-2024 Exam Papers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Unit 1 to Unit 5 Topic Segregation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Free & Open For BTech Students</span>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Platform Metrics */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-center p-3">
            <div className="text-3xl font-extrabold text-navy-900 dark:text-white mb-1">8</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Semesters Covered</div>
          </div>
          <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800">
            <div className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 mb-1">{subjects.length}+</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">AKTU Subjects</div>
          </div>
          <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">{stats.totalQuestions}+</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Curated PYQs & MCQs</div>
          </div>
          <div className="text-center p-3 border-l border-slate-100 dark:border-slate-800">
            <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 mb-1">70/100</div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Standard AKTU Pattern</div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white mb-3">
            Everything You Need to Ace AKTU Semester Exams
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Built following the official AKTU syllabus pattern: 2-mark compulsory questions (Section A), 7-mark core questions (Section B), and 10-mark deep analytical solutions (Section C).
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2">Unit-Wise Practice</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Filter questions by Unit 1, 2, 3, 4, or 5. Focus on high-weightage topics and master one syllabus unit at a time.
            </p>
            <Link to="/practice" className="text-xs font-semibold text-brand-600 dark:text-brand-400 inline-flex items-center gap-1 group-hover:underline">
              <span>Try Practice Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Timer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2">Mock Test Simulator</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Simulate actual examination pressure with optional countdown timer, review palette, and comprehensive score breakdown.
            </p>
            <Link to="/test" className="text-xs font-semibold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 group-hover:underline">
              <span>Start Mock Exam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2">Progress & Weak Spots</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Visual analytics pinpoint your weak subjects and units so you know exactly where to revise before exam day.
            </p>
            <Link to="/analytics" className="text-xs font-semibold text-violet-600 dark:text-violet-400 inline-flex items-center gap-1 group-hover:underline">
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Semester Jump */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-brand-950 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-extrabold mb-2">Select Your Semester & Begin Practicing</h2>
            <p className="text-xs text-slate-300 mb-6">
              Access syllabus-mapped previous year questions across all 8 semesters for Computer Science, Information Technology, and allied engineering streams.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <Link
                  key={sem}
                  to={`/subjects?semester=${sem}`}
                  className="p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-center font-bold text-xs transition-colors hover:scale-105"
                >
                  <div className="text-[10px] text-brand-300 font-medium">SEM</div>
                  <div className="text-base">{sem}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
