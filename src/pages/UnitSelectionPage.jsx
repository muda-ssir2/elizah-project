import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  ChevronLeft, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  Award
} from 'lucide-react';
import { dataService } from '../services/dataService';

export const UnitSelectionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subjectId = searchParams.get('subject') || 'BCS501';

  const allSubjects = dataService.getSubjects();
  const subject = allSubjects.find(s => s.id === subjectId) || allSubjects[0];
  const units = dataService.getUnits(subject.id);
  const allQuestions = dataService.getQuestions();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          to="/subjects"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Subjects</span>
        </Link>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {subject.name}
        </span>
      </div>

      {/* Subject Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              {subject.code}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Semester {subject.semester} • {subject.branch}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-medium">
              AKTU Scheme {subject.scheme}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mb-2">
            {subject.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {subject.description}
          </p>
        </div>

        <div className="shrink-0 flex flex-wrap gap-2">
          <Link
            to={`/practice?subject=${subject.id}`}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 inline-flex items-center gap-2 transition-all"
          >
            <span>Practice All Units</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Units 1-5 Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy-900 dark:text-white">
            Syllabus Units Breakdown (Units 1 - 5)
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ~14-20 Marks per Unit in End-Sem Paper
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {units.map((unit) => {
            const unitQuestions = allQuestions.filter(
              q => q.subjectId === subject.id && q.unitId === unit.id
            );
            const verifiedUnitCount = unitQuestions.filter(q => q.isVerifiedPyq).length;

            return (
              <div
                key={unit.id}
                className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/40 shadow-sm flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                      UNIT {unit.unitNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      ~{unit.weightageApprox} Marks Weightage
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {unit.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {unit.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{unitQuestions.length}</span> questions ({verifiedUnitCount} verified)
                  </div>

                  <Link
                    to={`/practice?subject=${subject.id}&unit=${unit.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Practice Unit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
