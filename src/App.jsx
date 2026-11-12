import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { SemesterSelectionPage } from './pages/SemesterSelectionPage';
import { SubjectSelectionPage } from './pages/SubjectSelectionPage';
import { UnitSelectionPage } from './pages/UnitSelectionPage';
import { PracticePage } from './pages/PracticePage';
import { MockTestPage } from './pages/MockTestPage';
import { PapersPage } from './pages/PapersPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';

const AppLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // If on landing page or auth page, hide sidebar for a clean presentation
  const isLandingOrAuth = location.pathname === '/' || location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {!isLandingOrAuth && (
          <Sidebar
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />
        )}

        <main className={`flex-1 p-4 sm:p-6 lg:p-8 min-w-0 ${!isLandingOrAuth ? 'md:pl-8' : ''}`}>
          {children}
        </main>
      </div>

      {!isLandingOrAuth && <BottomNav />}

      {/* Global Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-navy-900/50 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} AKTU PYQ HUB – Dr. A.P.J. Abdul Kalam Technical University Examination Practice Suite.</p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-slate-400">NEP 2022-23 Syllabus</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-600 dark:text-emerald-400">Verified AKTU Archive</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/semesters" element={<SemesterSelectionPage />} />
            <Route path="/subjects" element={<SubjectSelectionPage />} />
            <Route path="/units" element={<UnitSelectionPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/test" element={<MockTestPage />} />
            <Route path="/papers" element={<PapersPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
