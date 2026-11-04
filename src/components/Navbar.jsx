import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  BookOpen, 
  Award, 
  Search, 
  Menu, 
  X, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { getProgress } from '../utils/storage';
import { getAllBabsFlat } from '../utils/materiData';

export default function Navbar({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const totalBabs = getAllBabsFlat().length;
  const location = useLocation();

  const updateStats = () => {
    const progress = getProgress();
    setCompletedCount(progress.completedBabs?.length || 0);
  };

  useEffect(() => {
    updateStats();
    const handleUpdate = () => updateStats();
    window.addEventListener('fitgerak-progress-updated', handleUpdate);
    return () => window.removeEventListener('fitgerak-progress-updated', handleUpdate);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Beranda', icon: Activity },
    { to: '/materi', label: 'Daftar Materi', icon: BookOpen },
    { to: '/progres', label: 'Progres Belajar', icon: Award },
  ];

  const percentComplete = Math.round((completedCount / (totalBabs || 1)) * 100);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo & Abulyatama Partner */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/" className="flex items-center group shrink-0">
                <img 
                  src="/logo-fitgerak.png" 
                  alt="FitGerak - Hidup Sehat & Bugar" 
                  className="h-8.5 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              </Link>

              {/* Separator & Logo Abulyatama on Desktop */}
              <div className="h-7 w-px bg-slate-200 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2.5">
                <img 
                  src="/logo-abulyatama.png" 
                  alt="Logo Universitas Abulyatama" 
                  className="h-8.5 sm:h-10 w-auto object-contain drop-shadow-2xs"
                />
                <div className="hidden lg:flex flex-col">
                  <span className="text-[11px] font-bold text-slate-800 leading-tight">
                    Universitas Abulyatama
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    Mitra Edukasi Penjas
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || 
                  (item.to === '/materi' && (location.pathname.startsWith('/materi') || location.pathname.startsWith('/kuis')));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action: Search & Progress Pill */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search Button */}
              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-xs sm:text-sm text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/60 min-h-[40px]"
                title="Cari Materi"
                aria-label="Cari Materi"
              >
                <Search className="w-4 h-4 text-slate-600" />
                <span className="hidden md:inline font-normal">Cari materi...</span>
              </button>

              {/* Quick Progress Badge (Desktop & Tablet) */}
              <Link
                to="/progres"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/70 rounded-full transition-colors group min-h-[36px]"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
                <span className="text-xs font-bold text-emerald-800">
                  {completedCount}/{totalBabs} Bab
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-200/60 px-1.5 py-0.2 rounded-full">
                  {percentComplete}%
                </span>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Buka Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (Hanya Setengah Layar / ~65% Lebar dari Kanan) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          
          {/* Backdrop gelap di sebelah kiri (tekan untuk tutup) */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Panel Menu Setengah Layar (Off-Canvas Side Drawer) */}
          <div className="relative w-[70vw] max-w-[280px] h-full bg-white shadow-2xl z-10 flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-250 ease-out">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <img 
                  src="/logo-fitgerak.png" 
                  alt="FitGerak" 
                  className="h-8 w-auto object-contain"
                />

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 min-h-[36px] min-w-[36px] flex items-center justify-center"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-3 space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to ||
                    (item.to === '/materi' && (location.pathname.startsWith('/materi') || location.pathname.startsWith('/kuis')));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[42px] ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 shadow-2xs font-extrabold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </Link>
                  );
                })}
              </div>

            </div>

            {/* Drawer Bottom: Progress Summary */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/70">
              
              {/* Compact Progress Card */}
              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] text-slate-700">
                  <span className="font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Progres
                  </span>
                  <span className="font-extrabold text-emerald-800">{completedCount}/{totalBabs} Bab</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
