import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Flag, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  BarChart3, 
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { QuestionCard } from '../components/QuestionCard';
import { VerifiedBadge, DifficultyBadge, MarksBadge } from '../components/Badge';

export const MockTestPage = () => {
  const profile = dataService.getProfile();
  const allSubjects = dataService.getSubjects();
  const allQuestions = dataService.getQuestions();

  // Test setup states
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(profile.semester);
  const [selectedSubject, setSelectedSubject] = useState(
    allSubjects.find(s => s.semester === profile.semester)?.id || 'all'
  );
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [timerEnabled, setTimerEnabled] = useState(true);

  // Active test execution states
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: selectedOptionKey }
  const [reviewedFlags, setReviewedFlags] = useState({}); // { [qId]: boolean }
  const [visitedIndices, setVisitedIndices] = useState(new Set([0]));
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  // Available subjects for semester
  const availableSubjects = allSubjects.filter(
    s => selectedSemester === 'all' || s.semester === Number(selectedSemester)
  );

  // Start the test
  const handleStartTest = () => {
    let pool = allQuestions.filter(q => {
      const matchSem = selectedSemester === 'all' || q.semester === Number(selectedSemester);
      const matchSub = selectedSubject === 'all' || q.subjectId === selectedSubject;
      return matchSem && matchSub;
    });

    if (pool.length === 0) {
      pool = allQuestions; // fallback to all questions if none match
    }

    // Shuffle and pick questionCount
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    setTestQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setReviewedFlags({});
    setVisitedIndices(new Set([0]));
    setSecondsRemaining(durationMinutes * 60);
    setIsPaused(false);
    setIsTestStarted(true);
    setIsTestSubmitted(false);
  };

  // Timer effect
  useEffect(() => {
    if (isTestStarted && !isTestSubmitted && timerEnabled && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isTestStarted, isTestSubmitted, timerEnabled, isPaused]);

  const handleSelectOption = (qId, optionKey) => {
    if (isTestSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionKey
    }));
  };

  const handleToggleReview = (qId) => {
    setReviewedFlags(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleJumpToIndex = (idx) => {
    setCurrentIndex(idx);
    setVisitedIndices(prev => new Set(prev).add(idx));
  };

  const handleNext = () => {
    if (currentIndex < testQuestions.length - 1) {
      handleJumpToIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleJumpToIndex(currentIndex - 1);
    }
  };

  // Submit test and calculate scores
  const handleSubmitTest = () => {
    clearInterval(timerRef.current);
    setIsTestSubmitted(true);

    // Score computation
    let correct = 0;
    testQuestions.forEach(q => {
      const selected = userAnswers[q.id];
      if (q.questionType === 'mcq' && q.options) {
        const correctOpt = q.options.find(o => o.isCorrect);
        if (correctOpt && correctOpt.key === selected) {
          correct++;
        }
      } else {
        // If written question was attempted/completed
        if (userAnswers[q.id]) {
          correct++;
        }
      }
    });

    const total = testQuestions.length;
    const scorePct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeSpent = (durationMinutes * 60) - secondsRemaining;

    // Save test session to history
    dataService.saveSession({
      id: `test-sess-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      mode: 'mock_test',
      subjectName: selectedSubject !== 'all' ? allSubjects.find(s => s.id === selectedSubject)?.name : 'Multi-Subject Test',
      totalQuestions: total,
      attempted: Object.keys(userAnswers).length,
      correct,
      scorePercentage: scorePct,
      timeSpentSeconds: timeSpent
    });

    // Confetti celebration if score >= 70%
    if (scorePct >= 70) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) { /* ignore */ }
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Pre-test Configuration Screen
  if (!isTestStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Timer className="w-3.5 h-3.5" />
            <span>AKTU Timed Examination Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
            Custom Mock Test Setup
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Configure exam conditions, select subjects, set your timer, and test your exam readiness.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          {/* Semester */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Semester
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSelectedSemester(s);
                    setSelectedSubject('all');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    Number(selectedSemester) === s
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  Sem {s}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
              <option value="all">All Subjects (Comprehensive Mock)</option>
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code} - {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Question Count & Duration */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Number of Questions
              </label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      questionCount === count
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {count} Qs
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Test Duration (Minutes)
              </label>
              <div className="flex items-center gap-2">
                {[10, 15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDurationMinutes(mins)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      durationMinutes === mins
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timer Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-navy-900 dark:text-white">Enable Countdown Timer</div>
              <div className="text-[11px] text-slate-500">Auto-submits test when time elapses</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={timerEnabled}
                onChange={(e) => setTimerEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>

          <button
            type="button"
            onClick={handleStartTest}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4" />
            <span>Begin Mock Test</span>
          </button>
        </div>
      </div>
    );
  }

  // Post-test Result Analysis Screen
  if (isTestSubmitted) {
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    testQuestions.forEach(q => {
      const ans = userAnswers[q.id];
      if (!ans) {
        unattemptedCount++;
      } else if (q.questionType === 'mcq' && q.options) {
        const correctOpt = q.options.find(o => o.isCorrect);
        if (correctOpt && correctOpt.key === ans) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / testQuestions.length) * 100);

    return (
      <div className="space-y-8 animate-fade-in pb-16">
        {/* Result Header Card */}
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 text-center shadow-sm relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
            <Award className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mb-2">
            Test Completed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Review your performance, detailed solutions, and error explanations below.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{scorePct}%</div>
              <div className="text-xs text-slate-500">Score Accuracy</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{correctCount}</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-300">Correct Answers</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{incorrectCount}</div>
              <div className="text-xs text-rose-700 dark:text-rose-300">Incorrect</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{unattemptedCount}</div>
              <div className="text-xs text-amber-700 dark:text-amber-300">Unattempted</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setIsTestStarted(false);
                setIsTestSubmitted(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Take Another Test
            </button>
            <button
              onClick={() => handleStartTest()}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all"
            >
              Retake Same Test
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-navy-900 dark:text-white">
            Detailed Question Analysis & Answers
          </h2>

          {testQuestions.map((q, idx) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={idx}
            />
          ))}
        </div>
      </div>
    );
  }

  // Active Test Mode
  const currentQ = testQuestions[currentIndex];
  const isCurrentReviewed = reviewedFlags[currentQ?.id];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Test Header Bar: Timer & Actions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Question <span className="text-brand-600 text-sm">{currentIndex + 1}</span> of {testQuestions.length}
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="text-xs text-slate-500">
            Answered: <span className="font-semibold text-emerald-600">{answeredCount}</span>
          </div>
        </div>

        {timerEnabled && (
          <div className="flex items-center gap-2">
            <div className={`px-4 py-1.5 rounded-xl font-mono text-sm font-bold flex items-center gap-2 border ${
              secondsRemaining < 120 
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse dark:bg-rose-950/50 dark:text-rose-400' 
                : 'bg-slate-100 dark:bg-slate-800 text-navy-900 dark:text-slate-100 border-slate-200 dark:border-slate-700'
            }`}>
              <Timer className="w-4 h-4 text-brand-500" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              title={isPaused ? "Resume Test" : "Pause Test"}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        )}

        <button
          onClick={handleSubmitTest}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-all"
        >
          Submit Test
        </button>
      </div>

      {/* Main Test Body: Question Container + Navigation Palette */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Current Question */}
        <div className="lg:col-span-2 space-y-4">
          {currentQ && (
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-extrabold text-xs flex items-center justify-center">
                    Q{currentIndex + 1}
                  </span>
                  {currentQ.isVerifiedPyq ? (
                    <VerifiedBadge year={currentQ.examYear} />
                  ) : (
                    <DifficultyBadge difficulty={currentQ.difficulty} />
                  )}
                  <MarksBadge marks={currentQ.marks} />
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleReview(currentQ.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isCurrentReviewed
                      ? 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300'
                      : 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${isCurrentReviewed ? 'fill-purple-600 text-purple-600' : ''}`} />
                  <span>{isCurrentReviewed ? 'Marked for Review' : 'Mark for Review'}</span>
                </button>
              </div>

              {/* Question Text */}
              <h3 className="text-base md:text-lg font-semibold text-navy-900 dark:text-white leading-relaxed mb-6 whitespace-pre-line">
                {currentQ.questionText}
              </h3>

              {/* MCQ Options */}
              {currentQ.questionType === 'mcq' && currentQ.options && (
                <div className="space-y-3 mb-6">
                  {currentQ.options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectOption(currentQ.id, opt.key)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 text-brand-900 dark:text-brand-200 ring-2 ring-brand-500/30'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}>
                          {opt.key}
                        </span>
                        <span className="text-sm pt-0.5">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Written Question Option (Mark as Answered) */}
              {currentQ.questionType !== 'mcq' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 mb-6 text-xs text-slate-600 dark:text-slate-400">
                  <p className="mb-3">
                    This is a written descriptive/numerical question ({currentQ.marks} marks). Draft your solution on paper or mark as prepared.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, userAnswers[currentQ.id] ? null : 'answered')}
                    className={`px-4 py-2 rounded-xl font-semibold border transition-all ${
                      userAnswers[currentQ.id]
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-white text-slate-700 border-slate-300 dark:bg-navy-900 dark:text-slate-300'
                    }`}
                  >
                    {userAnswers[currentQ.id] ? '✓ Marked as Attempted' : 'Mark Question as Attempted'}
                  </button>
                </div>
              )}

              {/* Navigation Actions (Previous / Next) */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  disabled={currentIndex === testQuestions.length - 1}
                  onClick={handleNext}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Question Navigation Palette */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900 dark:text-white">
              Question Palette
            </h3>

            {/* Grid of question buttons */}
            <div className="grid grid-cols-5 gap-2">
              {testQuestions.map((q, idx) => {
                const isAnswered = Boolean(userAnswers[q.id]);
                const isReviewed = Boolean(reviewedFlags[q.id]);
                const isCurrent = currentIndex === idx;
                const isVisited = visitedIndices.has(idx);

                let paletteColor = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"; // unvisited

                if (isReviewed) {
                  paletteColor = "bg-purple-600 text-white font-bold";
                } else if (isAnswered) {
                  paletteColor = "bg-emerald-600 text-white font-bold";
                } else if (isVisited) {
                  paletteColor = "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"; // visited but unanswered
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleJumpToIndex(idx)}
                    className={`w-10 h-10 rounded-xl text-xs flex items-center justify-center transition-all ${paletteColor} ${
                      isCurrent ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-navy-900 font-extrabold scale-105' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Palette Legend */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-emerald-600 shrink-0" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-purple-600 shrink-0" />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 shrink-0 border border-amber-300" />
                <span>Not Answered (Visited)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-800 shrink-0" />
                <span>Not Visited</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
