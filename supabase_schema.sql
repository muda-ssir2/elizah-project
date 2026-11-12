-- =========================================================================
-- AKTU PYQ HUB - Production Supabase PostgreSQL Database Schema
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES / USERS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    semester INTEGER DEFAULT 5 CHECK (semester BETWEEN 1 AND 8),
    branch TEXT DEFAULT 'CSE',
    roll_number TEXT,
    college_name TEXT DEFAULT 'AKTU Affiliated Institute',
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SEMESTERS
CREATE TABLE IF NOT EXISTS public.semesters (
    id SERIAL PRIMARY KEY,
    number INTEGER UNIQUE NOT NULL CHECK (number BETWEEN 1 AND 8),
    name TEXT NOT NULL,
    year_level TEXT NOT NULL, -- '1st Year', '2nd Year', '3rd Year', '4th Year'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SUBJECTS
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY, -- e.g., 'BCS501'
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    semester INTEGER NOT NULL REFERENCES public.semesters(number) ON DELETE CASCADE,
    branch TEXT DEFAULT 'CSE',
    scheme TEXT DEFAULT '2022-23 (New)',
    total_units INTEGER DEFAULT 5,
    description TEXT,
    color_accent TEXT DEFAULT 'indigo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. UNITS
CREATE TABLE IF NOT EXISTS public.units (
    id TEXT PRIMARY KEY, -- e.g., 'BCS501-U1'
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_number INTEGER NOT NULL CHECK (unit_number BETWEEN 1 AND 5),
    title TEXT NOT NULL,
    description TEXT,
    weightage_approx INTEGER DEFAULT 20, -- Marks in AKTU exam usually ~20 marks per unit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (subject_id, unit_number)
);

-- 5. QUESTIONS
CREATE TABLE IF NOT EXISTS public.questions (
    id TEXT PRIMARY KEY, -- UUID or unique slug
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    unit_id TEXT NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
    semester INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'vsa', 'sa', 'la', 'numerical')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    marks INTEGER NOT NULL DEFAULT 2, -- AKTU standard marks: 2, 7, 10
    exam_year TEXT, -- '2023-24', '2022-23', etc.
    exam_session TEXT CHECK (exam_session IN ('ODD', 'EVEN', 'CARRYOVER', 'DEMO', NULL)),
    is_verified_pyq BOOLEAN DEFAULT TRUE,
    model_answer TEXT,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. QUESTION OPTIONS (For MCQ questions)
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_key CHAR(1) NOT NULL CHECK (option_key IN ('A', 'B', 'C', 'D')),
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (question_id, option_key)
);

-- 7. QUESTION PAPERS (Full Past Exam Papers)
CREATE TABLE IF NOT EXISTS public.question_papers (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    subject_code TEXT NOT NULL,
    subject_name TEXT NOT NULL,
    semester INTEGER NOT NULL,
    academic_year TEXT NOT NULL, -- e.g., '2023-24'
    exam_type TEXT NOT NULL CHECK (exam_type IN ('Regular', 'Carry-Over', 'Special')),
    exam_session TEXT NOT NULL CHECK (exam_session IN ('Odd Semester', 'Even Semester')),
    max_marks INTEGER DEFAULT 70, -- AKTU recent format is 70 marks (earlier 100)
    duration_hours NUMERIC DEFAULT 3,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. PRACTICE SESSIONS
CREATE TABLE IF NOT EXISTS public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('practice', 'mock_test', 'paper_practice', 'bookmarks_revision')),
    subject_id TEXT REFERENCES public.subjects(id),
    unit_id TEXT,
    total_questions INTEGER NOT NULL,
    answered_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    score NUMERIC DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    status TEXT DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. USER ANSWERS / RESULTS LOG
CREATE TABLE IF NOT EXISTS public.answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.practice_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_option CHAR(1), -- 'A', 'B', 'C', 'D' if MCQ
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    is_completed_written BOOLEAN DEFAULT FALSE,
    time_taken_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. BOOKMARKS
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, question_id)
);

-- Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Read policies for public educational content
CREATE POLICY "Public read for semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Public read for subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read for units" ON public.units FOR SELECT USING (true);
CREATE POLICY "Public read for questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public read for question_options" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "Public read for question_papers" ON public.question_papers FOR SELECT USING (true);

-- User specific policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own sessions" ON public.practice_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own answers" ON public.answers FOR ALL USING (auth.uid() = user_id);
