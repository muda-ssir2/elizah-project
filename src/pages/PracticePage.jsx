import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  HelpCircle, 
  Filter, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Award,
  ChevronDown,
  Search
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { QuestionCard } from '../components/QuestionCard';

export const PracticePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const profile = dataService.getProfile();

  // Read initial filter values from URL or defaults
  const initialSemester = searchParams.get('semester') || String(profile.semester);
  const initialSubject = searchParams.get('subject') || '';
  const initialUnit = searchParams.get('unit') || 'all';
  const initialType = searchParams.get('type') || 'all';
  const initialDifficulty = searchParams.get('difficulty') || 'all';
  const initialOnlyVerified = searchParams.get('verified') === 'true';

  const [semester, setSemester] = useState(initialSemester);
  const [subjectId, setSubjectId] = useState(initialSubject);
  const [unitId, setUnitId] = useState(initialUnit);
  const [questionType, setQuestionType] = useState(initialType);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [onlyVerified, setOnlyVerified] = useState(initialOnlyVerified);
  const [searchKeyword, setSearchKeyword] = useState('');

  const allSubjects = dataService.getSubjects();
  const allQuestions = dataService.getQuestions();

  // Filter available subjects based on selected semester
  const availableSubjects = useMemo(() => {
    return allSubjects.filter(s => s.semester === Number(semester));
  }, [allSubjects, semester]);

  // If no subject selected or selected subject doesn't belong to current semester, auto-pick first
  useEffect(() => {
    if (availableSubjects.length > 0) {
      if (!subjectId || !availableSubjects.some(s => s.id === subjectId)) {
        setSubjectId(availableSubjects[0].id);
      }
    } else {
      setSubjectId('');
    }
  }, [semester, availableSubjects]);

  // Available units for currently selected subject
  const availableUnits = useMemo(() => {
    if (!subjectId) return [];
    return dataService.getUnits(subjectId);
  }, [subjectId]);

  // Reset unit to 'all' if subject changed
  useEffect(() => {
    setUnitId('all');
  }, [subjectId]);

  // Synchronize URL parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (semester) params.set('semester', semester);
    if (subjectId) params.set('subject', subjectId);
    if (unitId !== 'all') params.set('unit', unitId);
    if (questionType !== 'all') params.set('type', questionType);
    if (difficulty !== 'all') params.set('difficulty', difficulty);
    if (onlyVerified) params.set('verified', 'true');
    setSearchParams(params, { replace: true });
  }, [semester, subjectId, unitId, questionType, difficulty, onlyVerified]);

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      // Semester match
      if (q.semester !== Number(semester)) return false;

      // Subject match
      if (subjectId && q.subjectId !== subjectId) return false;

      // Unit match
      if (unitId !== 'all' && q.unitId !== unitId) return false;

      // Question Type match
      if (questionType !== 'all' && q.questionType !== questionType) return false;

      // Difficulty match
      if (difficulty !== 'all' && q.difficulty !== difficulty) return false;

      // Only Verified match
      if (onlyVerified && !q.isVerifiedPyq) return false;

      // Keyword search
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchText = q.questionText.toLowerCase().includes(kw);
        const matchAnswer = q.modelAnswer?.toLowerCase().includes(kw);
        const matchYear = q.examYear?.toLowerCase().includes(kw);
        if (!matchText && !matchAnswer && !matchYear) return false;
      }

      return true;
    });
  }, [allQuestions, semester, subjectId, unitId, questionType, difficulty, onlyVerified, searchKeyword]);

  const handleResetFilters = () => {
    setSemester(String(profile.semester));
    setUnitId('all');
    setQuestionType('all');
    setDifficulty('all');
    setOnlyVerified(false);
    setSearchKeyword('');
  };

  const currentSubjectObj = allSubjects.find(s => s.id === subjectId);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive PYQ Practice Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
            Practice Previous Year Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select semester, subject, unit, and question category to tailor your practice session.
          </p>
        </div>

        <button
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Control Filter Bar (6-step selector) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Semester */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              1. Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>

          {/* 2. Subject */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              2. Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Unit */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              3. Unit
            </label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Units (1 to 5)</option>
              {availableUnits.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber}: {u.title.split(':')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Question Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              4. Question Type
            </label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Question Types</option>
              <option value="mcq">MCQs (Multiple Choice)</option>
              <option value="vsa">Very Short Answer (2 Marks)</option>
              <option value="sa">Short Answer (7 Marks)</option>
              <option value="la">Long Answer (10 Marks)</option>
              <option value="numerical">Numerical Problems</option>
            </select>
          </div>

          {/* 5. Difficulty */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              5. Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy (Definitions & Direct)</option>
              <option value="medium">Medium (Standard AKTU)</option>
              <option value="hard">Hard (Complex / Numerical)</option>
            </select>
          </div>
        </div>

        {/* Secondary Row: Search & Verified Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in questions..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto select-none">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Only Verified AKTU PYQs (Hide Demo Questions)</span>
            </span>
          </label>
        </div>
      </div>

      {/* Active Subject Context Banner */}
      {currentSubjectObj && (
        <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-navy-900/40 border border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-navy-900 dark:text-white">{currentSubjectObj.name} ({currentSubjectObj.code})</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-300">Semester {semester}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-300">{unitId === 'all' ? 'All 5 Units' : `Unit ${unitId.split('-U')[1] || ''}`}</span>
          </div>
          <div className="font-semibold text-brand-600 dark:text-brand-400">
            {filteredQuestions.length} Questions Found
          </div>
        </div>
      )}

      {/* Question Cards Feed */}
      <div className="space-y-4">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
            />
          ))
        ) : (
          <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1">
              No questions match the selected filter criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Try switching units or changing question type to view more practice items.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
