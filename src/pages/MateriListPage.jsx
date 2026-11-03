import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  Award, 
  Filter, 
  Search, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getAllCategories } from '../utils/materiData';
import { getProgress } from '../utils/storage';

export default function MateriListPage() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [progress, setProgress] = useState({ completedBabs: [], quizResults: {} });

  const loadData = () => {
    setCategories(getAllCategories());
    setProgress(getProgress());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('fitgerak-progress-updated', loadData);
    return () => window.removeEventListener('fitgerak-progress-updated', loadData);
  }, []);

  const filteredCategories = categories
    .filter(cat => selectedCategory === 'all' || cat.id === selectedCategory)
    .map(cat => {
      const babs = cat.babList.filter(bab => {
        if (!searchFilter.trim()) return true;
        const q = searchFilter.toLowerCase();
        return (
          bab.judul.toLowerCase().includes(q) ||
          bab.deskripsi.toLowerCase().includes(q)
        );
      });
      return { ...cat, filteredBabs: babs };
    })
    .filter(cat => cat.filteredBabs.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Kurikulum Edukasi Hidup Sehat</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Daftar Materi & Modul Belajar
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Pelajari setiap bab secara berurutan untuk mendapatkan pemahaman komprehensif, lalu uji pemahaman Anda melalui kuis 5 soal di akhir setiap bab.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Semua Topik
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {c.judul}
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <div className="relative sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari dalam materi..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-800"
          />
        </div>

      </div>

      {/* Categories & Chapter Cards */}
      <div className="space-y-10">
        {filteredCategories.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-800">Tidak ada materi yang sesuai</h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Coba reset filter kategori atau gunakan kata kunci pencarian yang lain.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchFilter(''); }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Tampilkan Semua Materi
            </button>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-4">
              
              {/* Category Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {cat.judul}
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {cat.filteredBabs.length} Bab
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  {cat.deskripsi}
                </p>
              </div>

              {/* Chapters List */}
              <div className="grid grid-cols-1 gap-4">
                {cat.filteredBabs.map((bab) => {
                  const key = `${cat.id}:${bab.id}`;
                  const isCompleted = progress.completedBabs?.includes(key);
                  const quiz = progress.quizResults?.[key];

                  return (
                    <div
                      key={bab.id}
                      className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 p-5 sm:p-6 shadow-2xs hover:shadow-lg hover:shadow-emerald-600/5 transition-all duration-300 ease-out hover:-translate-y-1 flex flex-col md:flex-row md:items-center justify-between gap-5 cursor-pointer"
                    >
                      {/* Left: Chapter Details */}
                      <div className="space-y-2 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
                            Bab {bab.nomor}
                          </span>
                          
                          <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {bab.estimasiMenit || 5} Menit Baca
                          </span>

                          {isCompleted && (
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Materi Selesai
                            </span>
                          )}

                          {quiz ? (
                            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                              quiz.passed 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              <Award className="w-3.5 h-3.5" />
                              Nilai Kuis: {quiz.score}/100 ({quiz.passed ? 'Lulus' : 'Belum Lulus'})
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                              Kuis Belum Dikerjakan
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {bab.judul}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {bab.deskripsi}
                        </p>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full md:w-auto pt-2 md:pt-0">
                        <Link
                          to={`/materi/${cat.id}/${bab.id}`}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-1.5 min-h-[42px]"
                        >
                          <span>{isCompleted ? 'Baca Ulang' : 'Buka Materi'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/kuis/${cat.id}/${bab.id}`}
                          className={`px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-1.5 min-h-[42px] ${
                            quiz?.passed
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <HelpCircle className="w-4 h-4 text-emerald-600" />
                          <span>{quiz ? 'Ulang Kuis' : 'Kuis Bab'}</span>
                        </Link>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

