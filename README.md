# 🎓 Elizah – AKTU PYQ HUB (BTech Exam Practice Platform)

> **A modern, responsive, high-performance web platform designed for B.Tech engineering students affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU), Uttar Pradesh.**

---

## 📖 Introduction & Project Overview

**Elizah** (AKTU PYQ HUB) is an educational SaaS and exam practice portal built to streamline semester examination preparation. Engineering students frequently struggle with scattered past-year questions, syllabus syllabus shifts (NEP 2022-23 schemes), and lack of timed exam practice.

Elizah bridges this gap by offering:
- **Verified Past-Year Question Bank** categorized by **Semester (1st to 8th)**, **Subject**, **Unit (1 to 5)**, and **Exam Year**.
- **Interactive Practice Engine** for Multiple Choice Questions (instant checking, detailed explanations) and Descriptive/Numerical questions (with step-by-step model solutions).
- **Timed Mock Examination Simulator** featuring question navigation palettes, review flags, real-time countdown, and automated scoring.
- **Official Question Paper Repository** covering Odd, Even, Regular, and Carry-Over examination cycles.
- **Visual Learning Analytics & Weakness Detection** powered by interactive Recharts.
- **Admin Content Management Portal** for managing syllabus subjects, authoring questions, and bulk JSON dataset imports.
- **Hybrid Storage Architecture**: Zero-setup local browser persistence out-of-the-box, with seamless plug-and-play **Supabase PostgreSQL** cloud backend.

---

## ⚡ Main Features

1. **Student Dashboard:**
   - Real-time learning streak, total available questions, attempted questions, correct responses, and overall accuracy percentage.
   - Enrolled semester progress tracking with completion percentage.
   - Quick jump to resume practice or launch a timed mock exam.

2. **Semester & Subject Directory:**
   - Seamless navigation across all 8 B.Tech semesters.
   - Configurable subject catalog mapped to the latest AKTU 2022-23 syllabus schemes.
   - Real-time search and filter by subject code (e.g. `BCS501`, `BAS103`) or topic name.

3. **Unit-Wise Syllabus Breakdown (Units 1 to 5):**
   - Precise unit weightage (~14 to 20 marks per unit in semester exams).
   - Topic-level question segregation for targeted revision.

4. **PYQ Practice System:**
   - 6-step filtering: Semester $\rightarrow$ Subject $\rightarrow$ Unit $\rightarrow$ Question Type $\rightarrow$ Difficulty $\rightarrow$ Verified Only.
   - Supports MCQs, 2-mark Very Short Answers (VSA), 7-mark Short Answers (SA), 10-mark Long Answers (LA), and Numerical Problems.
   - Clear distinction: Verified AKTU PYQ badges vs. Conceptual Demo badges.
   - Show/hide model answers, step-by-step derivations, and bookmarking.

5. **Timed Mock Test Simulator:**
   - Configurable question counts (5, 10, 15, 20) and custom exam duration.
   - Color-coded question palette (Answered: Green, Marked for Review: Purple, Unanswered: Amber, Not Visited: Slate).
   - Automatic score calculation, performance breakdown, and high-score celebrations.

6. **Official Exam Papers Archive:**
   - Filterable by academic year (2023-24, 2022-23, 2021-22, etc.), Odd/Even semester, and Regular/Carry-Over tests.
   - Direct option to practice questions from any specific past paper.

7. **Personal Revision Vault & Bookmarks:**
   - Save challenging questions for pre-exam night revision.
   - Filter bookmarked questions by subject with quick resolution tracking.

8. **Visual Analytics & Weakness Identifier:**
   - Subject-wise accuracy and mastery percentage bar charts.
   - Answer distribution pie charts.
   - Automatic identification of weak topics (&lt; 70% accuracy) for targeted revision.

9. **Staff & Admin Management Portal:**
   - Passcode-authenticated curriculum management (`aktu@2025` or `admin`).
   - Add/edit/delete subjects and questions.
   - Bulk JSON/CSV dataset import engine.

10. **Modern UI/UX & Themes:**
    - Linear / Notion / Vercel design language.
    - Deep Navy (`#0b1b2d`) and subtle Violet (`#6366f1`) color palette.
    - 1-click Light and Dark mode toggle with persistent preference.
    - Fully responsive with desktop sidebar navigation and mobile bottom navigation.

---

## 🛠 Technologies Used

| Category | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite 6 |
| **Styling & Design** | Tailwind CSS v3, PostCSS, Custom Design Tokens |
| **Icons** | Lucide React |
| **Data Visualizations** | Recharts (Responsive bar charts & split pies) |
| **Animations & Confetti** | Canvas Confetti |
| **Routing** | React Router v7 |
| **Database & Auth** | Supabase (PostgreSQL, Supabase Auth, Row Level Security) |
| **Local Storage Engine** | Reactive browser storage engine for zero-setup demo mode |
| **Language & Tooling** | JavaScript (ESModules), HTML5, CSS3, Git |

---

## 📂 Project Folder Structure

```
elizah/
├── .env.example                # Safe environment variable template
├── .gitignore                  # Git ignore rules (node_modules, .env, dist, etc.)
├── .vscode/
│   └── extensions.json         # Recommended VS Code workspace extensions
├── index.html                  # HTML5 entry with Inter font
├── package.json                # Project dependencies and npm scripts
├── postcss.config.js           # PostCSS configuration for Tailwind
├── README.md                   # Complete project documentation
├── supabase_schema.sql         # Production PostgreSQL database schema & RLS policies
├── tailwind.config.js          # Tailwind custom palette (navy, brand violet)
├── vite.config.js              # Vite server & build configurations
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Routing shell and responsive layout container
    ├── index.css               # Global styles, Tailwind directives, custom scrollbars
    ├── context/
    │   └── ThemeContext.jsx    # Light / Dark theme state and persistence
    ├── lib/
    │   └── supabase.ts         # Supabase client & dynamic connection detector
    ├── services/
    │   └── dataService.ts      # Curriculum seed data, subjects, units, question bank, local CRUD
    ├── components/
    │   ├── Badge.jsx           # Verified PYQ badges, demo badges, difficulty tags
    │   ├── BottomNav.jsx       # Mobile bottom navigation bar
    │   ├── Navbar.jsx          # Top bar with search, active semester pill, theme toggle
    │   ├── QuestionCard.jsx    # Interactive question card (MCQ & written answer modes)
    │   ├── Sidebar.jsx         # Desktop collapsible sidebar with quick metrics
    │   └── ThemeToggle.jsx     # Dark / Light mode toggle button
    └── pages/
        ├── AdminPage.jsx       # Staff portal for subjects, questions, and bulk import
        ├── AnalyticsPage.jsx   # Visual performance charts and weak topic analysis
        ├── AuthPage.jsx        # Supabase authentication and 1-click Guest mode
        ├── BookmarksPage.jsx   # Personal revision list for saved questions
        ├── DashboardPage.jsx   # Main student dashboard and statistics
        ├── LandingPage.jsx     # Modern educational homepage and feature highlights
        ├── MockTestPage.jsx    # Timed exam simulator with question navigation palette
        ├── PapersPage.jsx      # Official AKTU exam papers catalog
        ├── PracticePage.jsx    # Core 6-step unit-wise PYQ practice system
        ├── ProfilePage.jsx     # Student profile, branch, semester, and theme settings
        ├── SemesterSelectionPage.jsx # 1st to 8th semester selector
        ├── SubjectSelectionPage.jsx  # Searchable AKTU subjects catalog
        └── UnitSelectionPage.jsx     # Units 1-5 syllabus breakdown and weightage
```

---

## ⚙️ Environment Variable Setup

The project includes a safe template file: [`.env.example`](file:///c:/Users/Mudassir/Documents/elizah/.env.example).

If left blank, the application automatically runs in **Zero-Setup Local Storage Mode** (all features, practice questions, and admin CRUD work immediately without any external account).

To connect to your cloud **Supabase PostgreSQL** database:
1. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Populate the environment variables:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
3. Run the SQL schema from [`supabase_schema.sql`](file:///c:/Users/Mudassir/Documents/elizah/supabase_schema.sql) in your Supabase SQL Editor.

---

## 🚀 Installation & Local Development

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** / **pnpm**
- **Git**

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone https://github.com/muda-ssir2/elizah-project.git

# Enter project directory
cd elizah-project

# Install all npm dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
> Access the live app in your browser at: **`http://localhost:3000`**

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📸 Screenshots & Previews

| View | Description |
|---|---|
| **Student Dashboard** | Overview of question accuracy, streak, enrolled semester, and recent tests. |
| **Practice Engine** | 6-step filter with instant MCQ checking, model answers, and bookmarking. |
| **Mock Simulator** | Real-time countdown timer, review palette, and comprehensive score report. |
| **Visual Analytics** | Subject-wise radar/bar breakdown and weak topic detection. |
| **Admin Portal** | Passcode-protected management for subjects, questions, and JSON imports. |

---

## 🔮 Future Improvements

- [ ] **AI Solution Explainer**: Integration with Gemini API to explain complex AKTU numerical steps dynamically.
- [ ] **PDF Question Paper Exporter**: Instant 1-click printable PDF generation for Section A, B, and C papers.
- [ ] **Peer Discussion Forums**: Community answer discussions for disputed university questions.
- [ ] **Push Notifications**: Semester exam timetable countdowns and admit card release alerts.

---

## 👨‍💻 Author

**Mudassir**
- GitHub: [@muda-ssir2](https://github.com/muda-ssir2)
- Project Repository: [https://github.com/muda-ssir2/elizah-project](https://github.com/muda-ssir2/elizah-project)

---

## 📄 License
This project is licensed under the MIT License. Built for the academic advancement of engineering students.
