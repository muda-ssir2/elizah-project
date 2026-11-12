import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { dataService } from '../services/dataService';

export const SubjectSelectionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSemesterParam = searchParams.get('semester');
  const searchQueryParam = searchParams.get('search') || '';

  const [selectedSemester, setSelectedSemester] = useState(
    selectedSemesterParam ? Number(selectedSemesterParam) : 'all'
  );
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);

  const allSubjects = dataService.getSubjects();
  const allQuestions = dataService.getQuestions();

  const handleSemesterChange = (val) => {
    setSelectedSemester(val);
    if (val === 'all') {
      searchParams.delete('semester');
    } else {
      searchParams.set('semester', String(val));
    }
    setSearchParams(searchParams);
  };

  const filteredSubjects = useMemo(() => {
    return allSubjects.filter((sub) => {
      const matchSem = selectedSemester === 'all' || sub.semester === Number(selectedSemester);
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = 
        !query || 
        sub.name.toLowerCase().includes(query) || 
        sub.code.toLowerCase().includes(query) ||
        sub.branch.toLowerCase().includes(query);
      return matchSem && matchQuery;
    });
  }, [allSubjects, selectedSemester, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Syllabus & Subject Directory</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
          Explore AKTU BTech Subjects
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Search by subject code (e.g. BCS501, BAS103) or name. Select any subject to explore Unit 1 through Unit 5 questions.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects, codes, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>

        {/* Semester Filter Tabs / Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => handleSemesterChange('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSemester === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Semesters
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <button
              key={sem}
              onClick={() => handleSemesterChange(sem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                Number(selectedSemester) === sem
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((sub) => {
            const subjectQuestions = allQuestions.filter(q => q.subjectId === sub.id);
            const verifiedCount = subjectQuestions.filter(q => q.isVerifiedPyq).length;

            return (
              <div
                key={sub.id}
                className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                      {sub.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Semester {sub.semester}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {sub.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {sub.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                      {sub.totalUnits} Units
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-medium">
                      {verifiedCount} Verified PYQs
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                      {subjectQuestions.length} Total Questions
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                  <Link
                    to={`/units?subject=${sub.id}`}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                  >
                    View Units
                  </Link>

                  <Link
                    to={`/practice?subject=${sub.id}`}
                    className="flex-1 py-2 text-center text-xs font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">
              No matching subjects found
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search query or semester filter.
            </p>
            <button
              onClick={() => { setSelectedSemester('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
