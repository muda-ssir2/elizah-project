import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  BookOpen, 
  HelpCircle,
  Database
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { VerifiedBadge, DifficultyBadge, MarksBadge } from '../components/Badge';

export const AdminPage = () => {
  // Authentication state for admin
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('aktu_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active admin tab: 'questions' | 'subjects' | 'papers' | 'import'
  const [activeTab, setActiveTab] = useState('questions');

  // Real-time lists
  const [questions, setQuestions] = useState(() => dataService.getQuestions());
  const [subjects, setSubjects] = useState(() => dataService.getSubjects());
  const [papers, setPapers] = useState(() => dataService.getPapers());

  // Form states: New Question
  const [newQuestion, setNewQuestion] = useState({
    subjectId: subjects[0]?.id || 'BCS501',
    unitId: 'BCS501-U1',
    semester: 5,
    questionText: '',
    questionType: 'mcq',
    difficulty: 'medium',
    marks: 2,
    examYear: '2023-24',
    examSession: 'ODD',
    isVerifiedPyq: true,
    modelAnswer: '',
    explanation: '',
    options: [
      { key: 'A', text: '', isCorrect: true },
      { key: 'B', text: '', isCorrect: false },
      { key: 'C', text: '', isCorrect: false },
      { key: 'D', text: '', isCorrect: false }
    ]
  });

  // Form states: New Subject
  const [newSubject, setNewSubject] = useState({
    id: '',
    code: '',
    name: '',
    semester: 5,
    branch: 'CSE / IT / Allied',
    scheme: '2022-23 (New)',
    totalUnits: 5,
    description: '',
    colorAccent: 'from-blue-600 to-indigo-700'
  });

  // JSON / CSV import state
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Default passcodes for developer/admin access
    if (passcode === 'aktu@2025' || passcode === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('aktu_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid administrator credentials. Try: aktu@2025 or admin');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('aktu_admin_auth');
  };

  // --- Question CRUD ---
  const handleSaveQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.questionText.trim()) {
      alert("Question text is required.");
      return;
    }

    const questionToSave = {
      ...newQuestion,
      id: `Q-${newQuestion.subjectId}-${Date.now().toString().slice(-4)}`
    };

    dataService.saveQuestion(questionToSave);
    setQuestions(dataService.getQuestions());
    alert("Question added to repository successfully!");

    // Reset question form
    setNewQuestion(prev => ({
      ...prev,
      questionText: '',
      modelAnswer: '',
      explanation: '',
      options: [
        { key: 'A', text: '', isCorrect: true },
        { key: 'B', text: '', isCorrect: false },
        { key: 'C', text: '', isCorrect: false },
        { key: 'D', text: '', isCorrect: false }
      ]
    }));
  };

  const handleDeleteQuestion = (id) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      dataService.deleteQuestion(id);
      setQuestions(dataService.getQuestions());
    }
  };

  // --- Subject CRUD ---
  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!newSubject.id.trim() || !newSubject.name.trim()) {
      alert("Subject Code and Name are required.");
      return;
    }
    dataService.saveSubject(newSubject);
    setSubjects(dataService.getSubjects());
    alert("Subject added successfully!");
    setNewSubject({
      id: '',
      code: '',
      name: '',
      semester: 5,
      branch: 'CSE / IT / Allied',
      scheme: '2022-23 (New)',
      totalUnits: 5,
      description: '',
      colorAccent: 'from-blue-600 to-indigo-700'
    });
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm(`Delete subject ${id}? All related references will be removed.`)) {
      dataService.deleteSubject(id);
      setSubjects(dataService.getSubjects());
    }
  };

  // --- Bulk Import ---
  const handleBulkImport = () => {
    try {
      const parsed = JSON.parse(importText);
      if (!Array.isArray(parsed)) {
        setImportStatus('Error: JSON must be an array of question objects.');
        return;
      }
      const res = dataService.importQuestions(parsed);
      setQuestions(dataService.getQuestions());
      setImportStatus(`Success! Imported ${res.count} questions into the database.`);
      setImportText('');
    } catch (err) {
      setImportStatus(`Failed to parse JSON: ${err.message}`);
    }
  };

  // Not authenticated screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-navy-900 dark:text-white mb-1">
          AKTU Staff & Admin Portal
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Enter admin security passcode to manage subjects, upload past papers, and curate verified questions.
        </p>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Passcode (hint: aktu@2025)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full text-xs py-2.5 px-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-center font-mono"
            />
          </div>

          {authError && (
            <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {authError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            Authenticate Access
          </button>
        </form>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Administrator Authorized</span>
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900 dark:text-white">
            Curriculum & Content Management System
          </h1>
          <p className="text-xs text-slate-500">
            Control repository subjects, units, question papers, and import bulk question datasets.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 self-start sm:self-auto"
        >
          Sign Out
        </button>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 ${
            activeTab === 'questions'
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Manage Questions ({questions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 ${
            activeTab === 'subjects'
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manage Subjects ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('import')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 ${
            activeTab === 'import'
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Bulk JSON/CSV Import</span>
        </button>
      </div>

      {/* TAB 1: Questions Management */}
      {activeTab === 'questions' && (
        <div className="space-y-8">
          {/* Add Question Form */}
          <form onSubmit={handleSaveQuestion} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-500" />
              <span>Add New Question to PYQ Hub</span>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Subject</label>
                <select
                  value={newQuestion.subjectId}
                  onChange={(e) => {
                    const subId = e.target.value;
                    const subObj = subjects.find(s => s.id === subId);
                    setNewQuestion(prev => ({
                      ...prev,
                      subjectId: subId,
                      semester: subObj ? subObj.semester : prev.semester,
                      unitId: `${subId}-U1`
                    }));
                  }}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Unit Number</label>
                <select
                  value={newQuestion.unitId}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, unitId: e.target.value }))}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                >
                  {[1, 2, 3, 4, 5].map(u => (
                    <option key={u} value={`${newQuestion.subjectId}-U${u}`}>Unit {u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Question Type</label>
                <select
                  value={newQuestion.questionType}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, questionType: e.target.value }))}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                >
                  <option value="mcq">MCQ (Multiple Choice)</option>
                  <option value="vsa">Very Short Answer (2M)</option>
                  <option value="sa">Short Answer (7M)</option>
                  <option value="la">Long Answer (10M)</option>
                  <option value="numerical">Numerical Problem</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Marks</label>
                <input
                  type="number"
                  value={newQuestion.marks}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, marks: Number(e.target.value) }))}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Difficulty</label>
                <select
                  value={newQuestion.difficulty}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Exam Session Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2023-24"
                  value={newQuestion.examYear}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, examYear: e.target.value }))}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Exam Term</label>
                <select
                  value={newQuestion.examSession}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, examSession: e.target.value }))}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                >
                  <option value="ODD">ODD Semester</option>
                  <option value="EVEN">EVEN Semester</option>
                  <option value="CARRYOVER">Carry-Over</option>
                  <option value="DEMO">Demo Practice Only</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newQuestion.isVerifiedPyq}
                    onChange={(e) => setNewQuestion(prev => ({ ...prev, isVerifiedPyq: e.target.checked }))}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Verified AKTU PYQ</span>
                </label>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Question Statement</label>
              <textarea
                rows={3}
                placeholder="Type or paste the complete question text..."
                value={newQuestion.questionText}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, questionText: e.target.value }))}
                required
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
              />
            </div>

            {/* MCQ Options (If MCQ) */}
            {newQuestion.questionType === 'mcq' && (
              <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Options (Select radio for correct answer)</div>
                {newQuestion.options.map((opt, idx) => (
                  <div key={opt.key} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => {
                        const updated = newQuestion.options.map((o, i) => ({
                          ...o,
                          isCorrect: i === idx
                        }));
                        setNewQuestion(prev => ({ ...prev, options: updated }));
                      }}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs font-bold w-4">{opt.key}</span>
                    <input
                      type="text"
                      placeholder={`Option ${opt.key} text`}
                      value={opt.text}
                      onChange={(e) => {
                        const updated = [...newQuestion.options];
                        updated[idx].text = e.target.value;
                        setNewQuestion(prev => ({ ...prev, options: updated }));
                      }}
                      className="flex-1 text-xs py-1.5 px-3 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Model Answer & Explanation */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Model Answer / Solution</label>
                <textarea
                  rows={3}
                  placeholder="Detailed step-by-step solution..."
                  value={newQuestion.modelAnswer}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, modelAnswer: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Exam Tip / Key Concepts</label>
                <textarea
                  rows={3}
                  placeholder="Exam reasoning, common pitfalls..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Add Question to Bank
            </button>
          </form>

          {/* List of Existing Questions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-navy-900 dark:text-white">
              Current Question Repository ({questions.length})
            </h3>

            <div className="space-y-2">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-brand-600">{q.subjectId}</span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500">{q.unitId}</span>
                      {q.isVerifiedPyq ? (
                        <VerifiedBadge year={q.examYear} />
                      ) : (
                        <DifficultyBadge difficulty={q.difficulty} />
                      )}
                      <MarksBadge marks={q.marks} />
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                      {q.questionText}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Subjects Management */}
      {activeTab === 'subjects' && (
        <div className="space-y-8">
          <form onSubmit={handleSaveSubject} className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-navy-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-brand-500" />
              <span>Add / Configure Subject</span>
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Subject ID (Internal)</label>
                <input
                  type="text"
                  placeholder="e.g. BCS504"
                  value={newSubject.id}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, id: e.target.value.toUpperCase() }))}
                  required
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Subject Code</label>
                <input
                  type="text"
                  placeholder="e.g. BCS-504"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, code: e.target.value }))}
                  required
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Graphics"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Semester</label>
                <select
                  value={newSubject.semester}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, semester: Number(e.target.value) }))}
                  className="w-full text-xs py-2 px-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Syllabus Overview</label>
              <textarea
                rows={2}
                placeholder="Overview of topics and units..."
                value={newSubject.description}
                onChange={(e) => setNewSubject(prev => ({ ...prev, description: e.target.value }))}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm"
            >
              Save Subject
            </button>
          </form>

          {/* Subjects Table */}
          <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-navy-900 dark:text-white">
              Configured Subjects ({subjects.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Code</th>
                    <th className="py-2.5 px-4 font-semibold">Name</th>
                    <th className="py-2.5 px-4 font-semibold">Semester</th>
                    <th className="py-2.5 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subjects.map(sub => (
                    <tr key={sub.id}>
                      <td className="py-2.5 px-4 font-bold text-brand-600">{sub.code}</td>
                      <td className="py-2.5 px-4 font-semibold text-navy-900 dark:text-white">{sub.name}</td>
                      <td className="py-2.5 px-4 text-slate-500">Sem {sub.semester}</td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => handleDeleteSubject(sub.id)}
                          className="text-rose-500 hover:underline font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Bulk Import */}
      {activeTab === 'import' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-navy-900 dark:text-white">
            <Upload className="w-4 h-4 text-brand-500" />
            <span>Bulk Import Question Dataset (JSON Format)</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Paste an array of questions in JSON format. Each object can contain: 
            <code className="text-brand-600 dark:text-brand-400 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded ml-1">
              subjectId, unitId, semester, questionText, questionType, difficulty, marks, examYear, isVerifiedPyq, options, modelAnswer, explanation
            </code>.
          </p>

          <textarea
            rows={10}
            placeholder={`[
  {
    "subjectId": "BCS501",
    "unitId": "BCS501-U1",
    "semester": 5,
    "questionText": "What is an ER diagram? Explain entities, attributes, and relationships with diagram.",
    "questionType": "sa",
    "difficulty": "easy",
    "marks": 7,
    "examYear": "2023-24",
    "isVerifiedPyq": true,
    "modelAnswer": "Entity Relationship model..."
  }
]`}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className="w-full text-xs font-mono p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />

          {importStatus && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              importStatus.startsWith('Success')
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
            }`}>
              {importStatus}
            </div>
          )}

          <button
            type="button"
            onClick={handleBulkImport}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            Import Questions
          </button>
        </div>
      )}
    </div>
  );
};
