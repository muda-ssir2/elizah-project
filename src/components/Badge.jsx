import React from 'react';
import { CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';

export const VerifiedBadge = ({ year, session }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50">
    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
    <span>AKTU Verified PYQ {year ? `(${year}${session ? ` ${session}` : ''})` : ''}</span>
  </span>
);

export const DemoBadge = () => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50">
    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
    <span>Demo Practice Question</span>
  </span>
);

export const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    easy: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/50",
    medium: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50",
    hard: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize border ${styles[difficulty] || styles.medium}`}>
      {difficulty}
    </span>
  );
};

export const MarksBadge = ({ marks }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
    <Award className="w-3 h-3 text-brand-500" />
    <span>{marks} Marks</span>
  </span>
);

export const QuestionTypeBadge = ({ type }) => {
  const labels = {
    mcq: "Multiple Choice",
    vsa: "Very Short (2M)",
    sa: "Short Answer (7M)",
    la: "Long Answer (10M)",
    numerical: "Numerical Problem"
  };

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-brand-700 border border-indigo-200/60 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800/50">
      {labels[type] || type.toUpperCase()}
    </span>
  );
};
