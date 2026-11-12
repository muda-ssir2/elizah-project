import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  BookmarkCheck, 
  Trash2, 
  Play, 
  CheckCircle2, 
  HelpCircle, 
  Filter, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { QuestionCard } from '../components/QuestionCard';

export const BookmarksPage = () => {
  const [bookmarkIds, setBookmarkIds] = useState(() => dataService.getBookmarks());
  const allQuestions = dataService.getQuestions();
  const allSubjects = dataService.getSubjects();

  const [selectedSubject, setSelectedSubject] = useState('all');

  const bookmarkedQuestions = useMemo(() => {
    return allQuestions.filter(q => bookmarkIds.includes(q.id));
  }, [allQuestions, bookmarkIds]);

  const filteredBookmarks = useMemo(() => {
    if (selectedSubject === 'all') return bookmarkedQuestions;
    return bookmarkedQuestions.filter(q => q.subjectId === selectedSubject);
  }, [bookmarkedQuestions, selectedSubject]);

  const handleBookmarkToggle = (questionId, isSaved) => {
    if (!isSaved) {
      setBookmarkIds(prev => prev.filter(id => id !== questionId));
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all saved bookmarks?")) {
      bookmarkIds.forEach(id => dataService.toggleBookmark(id));
      setBookmarkIds([]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Personal Revision Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
            Saved Questions & Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review tricky concepts, bookmarked long-answer derivations, and revision problems.
          </p>
        </div>

        {bookmarkIds.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 transition-colors inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter by subject if bookmarks exist */}
      {bookmarkedQuestions.length > 0 && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {filteredBookmarks.length} bookmarked question{filteredBookmarks.length !== 1 ? 's' : ''}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filter Subject:</span>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs py-1.5 px-3 rounded-lg bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Subjects</option>
              {allSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Question Cards Feed */}
      <div className="space-y-4">
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))
        ) : (
          <div className="p-12 text-center bg-white dark:bg-navy-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <Bookmark className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-base font-bold text-navy-900 dark:text-white mb-1">
              No bookmarked questions yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
              Click the bookmark icon on any question card while practicing to add it here for quick pre-exam revision.
            </p>
            <Link
              to="/practice"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore Questions to Bookmark</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
