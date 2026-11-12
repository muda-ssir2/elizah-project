import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Target, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  Timer, 
  FileText,
  ChevronRight,
  Flame
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { VerifiedBadge, DifficultyBadge, MarksBadge } from '../components/Badge';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const profile = dataService.getProfile();
  const stats = dataService.getStats();
  const allSubjects = dataService.getSubjects();
  const semesterSubjects = dataService.getSubjectsBySemester(profile.semester);
  const questions = dataService.getQuestions();
  const recentPyqs = questions.slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* 1. Welcome Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-brand-900 text-white relative overflow-hidden shadow-lg shadow-brand-950/20">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AKTU Semester {profile.semester} Exam Preparation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.name}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Targeting <span className="font-semibold text-white">{profile.targetExamYear}</span>. Keep up your streak with high-frequency previous year questions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/practice"
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs shadow-md shadow-brand-500/30 transition-all hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              <span>Continue Practicing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/test"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all inline-flex items-center gap-2"
            >
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Mock Test</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Questions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Available</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 dark:text-white mb-1">
            {stats.totalQuestions}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Across all 5 units & types
          </div>
        </div>

        {/* Questions Attempted */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Attempted</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-navy-900 dark:text-white mb-1">
            {stats.attemptedCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {Math.round((stats.attemptedCount / (stats.totalQuestions || 1)) * 100)}% of database solved
          </div>
        </div>

        {/* Correct Answers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Correct Answers</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
            {stats.correctCount}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {stats.incorrectCount} mistakes logged
          </div>
        </div>

        {/* Overall Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-1">
            {stats.accuracy}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
            <div 
              className="bg-amber-500 h-full rounded-full" 
              style={{ width: `${Math.min(stats.accuracy, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Two Columns: Subject-wise Progress & Recent Practice Sessions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subject-Wise Progress (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900 dark:text-white">
                Semester {profile.semester} Subjects & Progress
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any subject card to practice unit-by-unit
              </p>
            </div>
            <Link 
              to={`/subjects?semester=${profile.semester}`}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {semesterSubjects.length > 0 ? (
              semesterSubjects.map((sub) => {
                const subQuestions = questions.filter(q => q.subjectId === sub.id);
                const answers = dataService.getAnswers();
                const answeredSubCount = subQuestions.filter(q => answers[q.id]).length;
                const progressPct = subQuestions.length > 0 ? Math.round((answeredSubCount / subQuestions.length) * 100) : 0;

                return (
                  <div
                    key={sub.id}
                    className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {sub.code}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {sub.totalUnits} Units
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                        {sub.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-500 dark:text-slate-400">
                          {answeredSubCount} / {subQuestions.length} Questions
                        </span>
                        <span className="text-brand-600 dark:text-brand-400 font-bold">
                          {progressPct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                        <div 
                          className="bg-brand-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <Link
                        to={`/practice?subject=${sub.id}`}
                        className="w-full py-1.5 text-center text-xs font-semibold rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 block transition-colors"
                      >
                        Practice PYQs
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 p-8 text-center bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No subjects listed yet for Semester {profile.semester}.</p>
                <Link to="/semesters" className="text-xs text-brand-600 dark:text-brand-400 font-bold mt-2 inline-block">
                  Change active semester
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Practice Sessions (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900 dark:text-white">
              Recent Practice History
            </h2>
            <Link 
              to="/analytics" 
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Full Log
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recentSessions.map((sess) => (
              <div 
                key={sess.id}
                className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900 dark:text-white mb-0.5">
                    <span>{sess.subjectName || "Practice Session"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{sess.date}</span>
                    <span>•</span>
                    <span>{sess.attempted} Qs</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-sm font-extrabold ${sess.scorePercentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {sess.scorePercentage}%
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">{sess.mode.replace('_', ' ')}</div>
                </div>
              </div>
            ))}

            <Link
              to="/test"
              className="block p-4 rounded-xl border border-dashed border-brand-300 dark:border-brand-800 text-center text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 transition-colors"
            >
              + Start New Timed Mock Test
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recently Added AKTU PYQs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-900 dark:text-white">
              Recently Curated AKTU PYQs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest questions extracted from verified examination papers
            </p>
          </div>
          <Link 
            to="/practice" 
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Practice All Questions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {recentPyqs.map((q) => {
            const sub = allSubjects.find(s => s.id === q.subjectId);
            return (
              <div 
                key={q.id}
                className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400">
                      {sub?.name || q.subjectId}
                    </span>
                    {q.isVerifiedPyq ? (
                      <VerifiedBadge year={q.examYear} />
                    ) : (
                      <DifficultyBadge difficulty={q.difficulty} />
                    )}
                    <MarksBadge marks={q.marks} />
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 mb-3">
                    {q.questionText}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
                    Type: {q.questionType.toUpperCase()}
                  </span>
                  <Link
                    to={`/practice?subject=${q.subjectId}&unit=${q.unitId}`}
                    className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Practice this</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
