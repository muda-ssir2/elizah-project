import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Layers, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  GraduationCap, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { INITIAL_SEMESTERS, dataService } from '../services/dataService';

export const SemesterSelectionPage = () => {
  const navigate = useNavigate();
  const profile = dataService.getProfile();
  const allSubjects = dataService.getSubjects();

  const handleSelectSemester = (semNum) => {
    dataService.updateProfile({ semester: semNum });
    navigate(`/subjects?semester=${semNum}`);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          <Layers className="w-3.5 h-3.5" />
          <span>AKTU BTech Academic Syllabus Scheme</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
          Choose Your Semester
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Select any semester from 1st to 8th to browse updated AKTU subjects, unit-wise questions, and verified question papers.
        </p>
      </div>

      {/* Grid of 8 Semesters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {INITIAL_SEMESTERS.map((sem) => {
          const semSubjects = allSubjects.filter(s => s.semester === sem.number);
          const isCurrent = profile.semester === sem.number;

          return (
            <div
              key={sem.number}
              onClick={() => handleSelectSemester(sem.number)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group relative ${
                isCurrent
                  ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-500/70 shadow-md shadow-brand-500/10'
                  : 'bg-white dark:bg-navy-900 border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 hover:shadow-md'
              }`}
            >
              {isCurrent && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-600 text-white shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Enrolled</span>
                </div>
              )}

              <div>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider block mb-1">
                  {sem.yearLevel}
                </span>
                <h3 className="text-xl font-extrabold text-navy-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {sem.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {sem.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 text-brand-500" />
                  {semSubjects.length} Core Subjects
                </span>
                <span className="text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  <span>Browse</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheme Information Note */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-800 dark:text-slate-200">Configurable AKTU Scheme: </span>
          All subjects and syllabus units adhere to the latest AKTU 2022-23 National Education Policy (NEP) revision. Administrators can add new subjects or modify syllabus outlines directly from the Admin Portal.
        </div>
      </div>
    </div>
  );
};
