import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Award,
  Layers,
  BookOpen
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { VerifiedBadge } from '../components/Badge';

export const PapersPage = () => {
  const profile = dataService.getProfile();
  const allPapers = dataService.getPapers();
  const allSubjects = dataService.getSubjects();

  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedExamType, setSelectedExamType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering papers
  const filteredPapers = useMemo(() => {
    return allPapers.filter((p) => {
      const matchSem = selectedSemester === 'all' || p.semester === Number(selectedSemester);
      const matchYear = selectedYear === 'all' || p.academicYear === selectedYear;
      const matchType = selectedExamType === 'all' || p.examType === selectedExamType;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = 
        !query || 
        p.subjectName.toLowerCase().includes(query) || 
        p.subjectCode.toLowerCase().includes(query);

      return matchSem && matchYear && matchType && matchQuery;
    });
  }, [allPapers, selectedSemester, selectedYear, selectedExamType, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <FileText className="w-3.5 h-3.5" />
          <span>Official AKTU University Papers Repository</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
          Previous Year Question Papers
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Complete official past semester papers organized by academic session, semester, and regular/carry-over examinations.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Search Paper
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="DBMS, BCS501, OS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Semesters (1 to 8)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Academic Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Exam Sessions</option>
              <option value="2023-24">2023-24 (Latest)</option>
              <option value="2022-23">2022-23</option>
              <option value="2021-22">2021-22</option>
              <option value="2020-21">2020-21</option>
            </select>
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Exam Type
            </label>
            <select
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Types</option>
              <option value="Regular">Regular Examination</option>
              <option value="Carry-Over">Carry-Over Examination</option>
            </select>
          </div>
        </div>
      </div>

      {/* Papers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper) => (
            <div
              key={paper.id}
              className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-brand-500/50 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {paper.subjectCode}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/50">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Paper</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-navy-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {paper.subjectName}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-5">
                  <div className="flex items-center justify-between">
                    <span>Semester:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Semester {paper.semester}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Academic Year:</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">{paper.academicYear} ({paper.examSession})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pattern:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{paper.maxMarks} Marks ({paper.durationHours} Hours)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Examination:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{paper.examType}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Link
                  to={`/practice?subject=${paper.subjectId}&semester=${paper.semester}&verified=true`}
                  className="w-full py-2.5 text-center text-xs font-bold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm inline-flex items-center justify-center gap-2 transition-all"
                >
                  <span>Practice Questions from This Paper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-navy-900 dark:text-white mb-1">
              No papers found matching filters
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Try selecting "All Semesters" or clearing search keywords.
            </p>
            <button
              onClick={() => { setSelectedSemester('all'); setSelectedYear('all'); setSelectedExamType('all'); setSearchQuery(''); }}
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
