import React, { useState } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  HelpCircle, 
  Award,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { VerifiedBadge, DemoBadge, DifficultyBadge, MarksBadge, QuestionTypeBadge } from './Badge';
import { dataService } from '../services/dataService';

export const QuestionCard = ({ 
  question, 
  index, 
  onBookmarkToggle,
  onAnswerSubmit,
  showFullDetails = true 
}) => {
  const isBookmarkedInitial = dataService.isBookmarked(question.id);
  const existingAnswers = dataService.getAnswers();
  const savedAnswer = existingAnswers[question.id];

  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
  const [selectedOption, setSelectedOption] = useState(savedAnswer?.selectedOption || null);
  const [isSubmitted, setIsSubmitted] = useState(Boolean(savedAnswer));
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCompletedWritten, setIsCompletedWritten] = useState(Boolean(savedAnswer?.completedWritten));

  const handleBookmark = () => {
    const newState = dataService.toggleBookmark(question.id);
    setIsBookmarked(newState);
    if (onBookmarkToggle) onBookmarkToggle(question.id, newState);
  };

  const handleOptionSelect = (key) => {
    if (isSubmitted) return; // Prevent changing after submission
    setSelectedOption(key);
  };

  const handleSubmitMcq = () => {
    if (!selectedOption) return;
    const correctOpt = question.options?.find(o => o.isCorrect);
    const isCorrect = correctOpt ? correctOpt.key === selectedOption : false;

    setIsSubmitted(true);
    dataService.recordAnswer(question.id, {
      selectedOption,
      isCorrect
    });

    if (onAnswerSubmit) {
      onAnswerSubmit(question.id, isCorrect);
    }
  };

  const handleToggleWrittenComplete = () => {
    const nextState = !isCompletedWritten;
    setIsCompletedWritten(nextState);
    dataService.recordAnswer(question.id, {
      isCorrect: nextState,
      completedWritten: nextState
    });

    if (onAnswerSubmit) {
      onAnswerSubmit(question.id, nextState);
    }
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow relative">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/70">
        <div className="flex flex-wrap items-center gap-2">
          {index !== undefined && (
            <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center">
              #{index + 1}
            </span>
          )}
          {question.isVerifiedPyq ? (
            <VerifiedBadge year={question.examYear} session={question.examSession} />
          ) : (
            <DemoBadge />
          )}
          <QuestionTypeBadge type={question.questionType} />
          <DifficultyBadge difficulty={question.difficulty} />
          <MarksBadge marks={question.marks} />
        </div>

        <button
          onClick={handleBookmark}
          className={`p-2 rounded-xl transition-all border ${
            isBookmarked
              ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/60'
              : 'text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={isBookmarked ? "Remove Bookmark" : "Save Question to Bookmarks"}
          aria-label="Bookmark question"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 fill-amber-500" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Question Text */}
      <div className="mb-5">
        <h3 className="text-base md:text-lg font-semibold text-navy-900 dark:text-slate-100 leading-relaxed whitespace-pre-line">
          {question.questionText}
        </h3>
      </div>

      {/* MCQ Section */}
      {question.questionType === 'mcq' && question.options && (
        <div className="space-y-2.5 mb-5">
          {question.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            let optionStyles = "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-navy-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200";

            if (isSelected && !isSubmitted) {
              optionStyles = "border-brand-500 bg-brand-50/80 dark:bg-brand-950/50 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/20";
            }

            if (isSubmitted) {
              if (opt.isCorrect) {
                optionStyles = "border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-medium";
              } else if (isSelected && !opt.isCorrect) {
                optionStyles = "border-rose-500 bg-rose-50/90 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20";
              }
            }

            return (
              <button
                key={opt.key}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleOptionSelect(opt.key)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${optionStyles}`}
              >
                <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                  isSubmitted && opt.isCorrect
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : isSubmitted && isSelected && !opt.isCorrect
                    ? 'bg-rose-600 text-white border-rose-600'
                    : isSelected
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                }`}>
                  {opt.key}
                </span>
                <span className="text-sm flex-1 pt-0.5">{opt.text}</span>
                {isSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isSubmitted && isSelected && !opt.isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}

          {/* Action Row for MCQ */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            {!isSubmitted ? (
              <button
                type="button"
                onClick={handleSubmitMcq}
                disabled={!selectedOption}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm transition-all"
              >
                Check Answer
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {question.options?.find(o => o.key === selectedOption)?.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4" /> Correct Answer (+{question.marks} Marks)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800">
                    <XCircle className="w-4 h-4" /> Incorrect Answer
                  </span>
                )}
              </div>
            )}

            {question.explanation && (
              <button
                type="button"
                onClick={() => setShowAnswer(!showAnswer)}
                className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 ml-auto"
              >
                {showAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{showAnswer ? 'Hide Explanation' : 'View Explanation'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Written Questions (VSA, SA, LA, Numerical) */}
      {question.questionType !== 'mcq' && (
        <div className="space-y-4 mb-4">
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {question.modelAnswer && (
              <button
                type="button"
                onClick={() => setShowAnswer(!showAnswer)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors"
              >
                {showAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showAnswer ? 'Hide Model Solution' : 'Reveal Model Solution'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleWrittenComplete}
              className={`px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all border ${
                isCompletedWritten
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 dark:bg-navy-900 dark:text-slate-300 dark:border-slate-700'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${isCompletedWritten ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{isCompletedWritten ? 'Marked Completed' : 'Mark as Completed'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Expandable Model Answer / Explanation */}
      {showAnswer && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 animate-fade-in space-y-3">
          {question.modelAnswer && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200/70 dark:border-slate-800/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                <span>AKTU Model Answer & Step-by-Step Solution</span>
              </div>
              <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed font-mono">
                {question.modelAnswer}
              </div>
            </div>
          )}

          {question.explanation && (
            <div className="p-3.5 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40 text-xs text-brand-950 dark:text-brand-200">
              <span className="font-bold">Exam Tip / Reasoning: </span>
              <span>{question.explanation}</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
