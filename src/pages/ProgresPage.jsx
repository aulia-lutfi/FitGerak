import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  TrendingUp,
  AlertCircle,
  XCircle,
  Check
} from 'lucide-react';
import { getAllCategories, getAllBabsFlat } from '../utils/materiData';
import { getProgress, resetProgress } from '../utils/storage';

export default function ProgresPage() {
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState({ completedBabs: [], quizResults: {} });
  const [showResetModal, setShowResetModal] = useState(false);

  const loadData = () => {
    setCategories(getAllCategories());
    setProgress(getProgress());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('fitgerak-progress-updated', loadData);
    return () => window.removeEventListener('fitgerak-progress-updated', loadData);
  }, []);

  const allBabs = getAllBabsFlat();
  const totalBabs = allBabs.length;
  const completedCount = progress.completedBabs?.length || 0;
  const percentComplete = totalBabs > 0 ? Math.round((completedCount / totalBabs) * 100) : 0;

  const quizKeys = Object.keys(progress.quizResults || {});
  const quizAttemptCount = quizKeys.length;

  const passedQuizCount = quizKeys.filter(
    (k) => progress.quizResults[k]?.passed
  ).length;

  const totalScoreSum = quizKeys.reduce((acc, k) => {
    return acc + (progress.quizResults[k]?.score || 0);
  }, 0);

  const averageScore = quizAttemptCount > 0 ? Math.round(totalScoreSum / quizAttemptCount) : 0;

  const getOverallStatus = () => {
    if (completedCount === 0 && quizAttemptCount === 0) {
      return { 
        label: 'Belum Mulai', 
        sub: 'Mulai bab pertama Anda', 
        iconBg: 'bg-slate-100 text-slate-500' 
      };
    }
    if (percentComplete === 100) {
      return { 
        label: 'Pakar Bugar', 
        sub: 'Luar biasa! 9 bab tuntas', 
        iconBg: 'bg-emerald-100 text-emerald-700' 
      };
    }
    if (percentComplete >= 70) {
      return { 
        label: 'Tingkat Mahir', 
        sub: `${totalBabs - completedCount} Bab lagi menuju tuntas`, 
        iconBg: 'bg-teal-100 text-teal-700' 
      };
    }
    if (percentComplete >= 35) {
      return { 
        label: 'Pejuang Aktif', 
        sub: `${totalBabs - completedCount} Bab tersisa`, 
        iconBg: 'bg-blue-100 text-blue-700' 
      };
    }
    return { 
      label: 'Pemula Bugar', 
      sub: `${totalBabs - completedCount} Bab tersisa`, 
      iconBg: 'bg-emerald-50 text-emerald-600' 
    };
  };

  const statusInfo = getOverallStatus();

  const handleConfirmReset = () => {
    resetProgress();
    setShowResetModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Penyimpanan Lokal Browser (localStorage)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Progres Belajar & Riwayat Kuis
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
            Semua catatan materi yang selesai dan hasil kuis tersimpan secara otomatis di perangkat Anda tanpa perlu mendaftar akun.
          </p>
        </div>

        {/* Reset Button */}
        {(completedCount > 0 || quizAttemptCount > 0) && (
          <button
            onClick={() => setShowResetModal(true)}
            className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Riwayat Belajar</span>
          </button>
        )}
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1 */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Materi Selesai
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {completedCount} <span className="text-base font-medium text-slate-400">/ {totalBabs}</span>
          </div>
          <div className="text-xs text-slate-500">
            {percentComplete}% dari seluruh kurikulum
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kuis Lulus
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {passedQuizCount} <span className="text-base font-medium text-slate-400">/ {totalBabs}</span>
          </div>
          <div className="text-xs text-slate-500">
            Batas kelulusan nilai: 70
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rata-rata Nilai
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {averageScore} <span className="text-base font-medium text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-slate-500">
            Dari {quizAttemptCount} kuis yang dikerjakan
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status Keseluruhan
            </span>
            <div className={`w-8 h-8 rounded-lg ${statusInfo.iconBg} flex items-center justify-center transition-colors`}>
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
            {statusInfo.label}
          </div>
          <div className="text-xs text-slate-500">
            {statusInfo.sub}
          </div>
        </div>

      </div>

      {/* Overall Progress Bar */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-bold text-slate-800">Progres Kurikulum FitGerak</span>
          <span className="font-extrabold text-emerald-700">{percentComplete}% Selesai</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Chapters Breakdown per Category */}
      <div className="space-y-8">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Rincian Status Bab & Nilai Kuis
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Klik materi untuk membaca kembali atau ulangi kuis untuk meningkatkan perolehan nilai.
          </p>
        </div>

        {categories.map((cat) => (
          <div key={cat.id} className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">{cat.judul}</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {cat.babList.length} Bab
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {cat.babList.map((bab) => {
                const key = `${cat.id}:${bab.id}`;
                const isCompleted = progress.completedBabs?.includes(key);
                const quiz = progress.quizResults?.[key];

                return (
                  <div 
                    key={bab.id} 
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isCompleted 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <span className="text-xs">{bab.nomor}</span>}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/materi/${cat.id}/${bab.id}`}
                            className="text-sm font-bold text-slate-800 hover:text-emerald-700 transition-colors"
                          >
                            Bab {bab.nomor}: {bab.judul}
                          </Link>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {bab.deskripsi}
                        </p>
                      </div>
                    </div>

                    {/* Right: Quiz Status & Action */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0 self-start sm:self-center shrink-0">
                      {quiz ? (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            quiz.passed 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            Nilai: {quiz.score}/100 ({quiz.passed ? 'Lulus' : 'Belum Lulus'})
                          </span>

                          <Link
                            to={`/kuis/${cat.id}/${bab.id}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 min-h-[36px] min-w-[36px] flex items-center justify-center"
                            title="Ulangi Kuis"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Link>
                        </div>
                      ) : (
                        <Link
                          to={`/kuis/${cat.id}/${bab.id}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors min-h-[36px] flex items-center justify-center"
                        >
                          Mulai Kuis
                        </Link>
                      )}

                      <Link
                        to={`/materi/${cat.id}/${bab.id}`}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors min-h-[36px] flex items-center justify-center"
                      >
                        Buka
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Confirmation Modal for Reset */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" 
            onClick={() => setShowResetModal(false)} 
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 z-10 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Hapus Semua Riwayat Belajar?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tindakan ini akan mengosongkan status bab yang telah diselesaikan dan riwayat nilai kuis yang tersimpan di browser Anda. Anda akan memulai dari awal.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20"
              >
                Ya, Hapus Riwayat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

