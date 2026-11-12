import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  AlertTriangle, 
  Clock, 
  Award,
  Sparkles,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { dataService } from '../services/dataService';

export const AnalyticsPage = () => {
  const stats = dataService.getStats();
  const allSubjects = dataService.getSubjects();
  const allQuestions = dataService.getQuestions();
  const answers = dataService.getAnswers();
  const sessions = dataService.getSessions();

  // Subject-wise performance breakdown data
  const subjectPerformanceData = allSubjects.map((sub) => {
    const subQuestions = allQuestions.filter(q => q.subjectId === sub.id);
    const subAnswers = subQuestions.map(q => answers[q.id]).filter(Boolean);
    const correctCount = subAnswers.filter(a => a.isCorrect || a.completedWritten).length;
    const attemptedCount = subAnswers.length;
    const accuracy = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    return {
      code: sub.code,
      name: sub.name,
      total: subQuestions.length,
      attempted: attemptedCount,
      correct: correctCount,
      accuracy
    };
  }).filter(s => s.total > 0).slice(0, 7);

  // Weak Topics & Strengths analysis
  const weakTopics = subjectPerformanceData
    .filter(s => s.attempted > 0 && s.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy);

  const strongTopics = subjectPerformanceData
    .filter(s => s.attempted > 0 && s.accuracy >= 70)
    .sort((a, b) => b.accuracy - a.accuracy);

  // Accuracy Pie chart data
  const pieData = [
    { name: 'Correct Answers', value: stats.correctCount || 1, color: '#10B981' },
    { name: 'Incorrect Answers', value: stats.incorrectCount || 0, color: '#EF4444' },
    { name: 'Unattempted', value: Math.max(0, stats.totalQuestions - stats.attemptedCount), color: '#94A3B8' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Real-time Learning Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
          Performance & Accuracy Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Deep visual inspection of your syllabus mastery, topic accuracy, and examination weak spots.
        </p>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Questions Attempted
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mb-2">
            {stats.attemptedCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Out of {stats.totalQuestions} questions in bank
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            Correct Answers
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-2">
            {stats.correctCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Verified mastery count
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
            Incorrect / Needs Review
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400 mb-2">
            {stats.incorrectCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Logged for revision
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            Overall Accuracy
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mb-2">
            {stats.accuracy}%
          </div>
          <div className="text-[11px] text-slate-500">
            Target &gt; 75% for AKTU Honours
          </div>
        </div>
      </div>

      {/* Visual Charts: Bar Chart & Pie Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subject-Wise Performance Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-900 dark:text-white">
              Subject-Wise Accuracy & Mastery (%)
            </h2>
            <span className="text-xs text-slate-500">AKTU Core Subjects</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="code" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="accuracy" name="Accuracy %" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy Proportion Pie Chart (1 Col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 flex flex-col justify-between">
          <h2 className="text-base font-bold text-navy-900 dark:text-white">
            Overall Response Split
          </h2>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Correct:</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{stats.correctCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Incorrect:</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{stats.incorrectCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>Unattempted:</span>
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {Math.max(0, stats.totalQuestions - stats.attemptedCount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics vs Strengths */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak Topics */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Topics Requiring Revision (&lt; 70% Accuracy)</span>
          </div>

          {weakTopics.length > 0 ? (
            <div className="space-y-3 pt-2">
              {weakTopics.map(item => (
                <div key={item.code} className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-navy-900 dark:text-white">{item.name} ({item.code})</div>
                    <div className="text-[11px] text-slate-500">Attempted {item.attempted} questions</div>
                  </div>
                  <div className="text-sm font-extrabold text-rose-600">{item.accuracy}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              No weak areas identified yet! Keep practicing to calibrate accuracy.
            </div>
          )}
        </div>

        {/* Strong Topics */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Strong Topics (&ge; 70% Accuracy)</span>
          </div>

          {strongTopics.length > 0 ? (
            <div className="space-y-3 pt-2">
              {strongTopics.map(item => (
                <div key={item.code} className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-navy-900 dark:text-white">{item.name} ({item.code})</div>
                    <div className="text-[11px] text-slate-500">Attempted {item.attempted} questions</div>
                  </div>
                  <div className="text-sm font-extrabold text-emerald-600">{item.accuracy}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              Solve more questions in Practice Mode to build your strength profile.
            </div>
          )}
        </div>
      </div>

      {/* Practice Sessions History Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-navy-900 dark:text-white">
          Comprehensive Practice History Log
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-navy-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Mode</th>
                <th className="py-3 px-4 font-semibold">Subject / Scope</th>
                <th className="py-3 px-4 font-semibold">Questions</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sessions.map((sess) => (
                <tr key={sess.id} className="hover:bg-slate-50/50 dark:hover:bg-navy-950/30">
                  <td className="py-3 px-4 text-slate-500">{sess.date}</td>
                  <td className="py-3 px-4 font-medium capitalize text-navy-900 dark:text-white">
                    {sess.mode.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    {sess.subjectName || "Comprehensive"}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {sess.attempted} / {sess.totalQuestions}
                  </td>
                  <td className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">
                    {sess.scorePercentage}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
