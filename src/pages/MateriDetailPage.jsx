import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  HelpCircle, 
  Share2, 
  Sparkles, 
  Check, 
  ChevronRight,
  Lightbulb,
  Dumbbell
} from 'lucide-react';
import { getBabDetail, getNextBab, getPreviousBab } from '../utils/materiData';
import { isBabCompleted, markBabCompleted, getQuizResult } from '../utils/storage';
import VisualSection from '../components/VisualSection';

export default function MateriDetailPage() {
  const { kategoriId, babId } = useParams();
  const navigate = useNavigate();

  const [bab, setBab] = useState(null);
  const [nextBab, setNextBab] = useState(null);
  const [prevBab, setPrevBab] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [quizInfo, setQuizInfo] = useState(null);
  const [justCompletedToast, setJustCompletedToast] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const detail = getBabDetail(kategoriId, babId);
    if (!detail) {
      navigate('/materi');
      return;
    }
    setBab(detail);
    setNextBab(getNextBab(kategoriId, babId));
    setPrevBab(getPreviousBab(kategoriId, babId));
    setCompleted(isBabCompleted(kategoriId, babId));
    setQuizInfo(getQuizResult(kategoriId, babId));
  }, [kategoriId, babId, navigate]);

  const handleMarkComplete = () => {
    if (bab) {
      markBabCompleted(kategoriId, babId, bab.judul);
      setCompleted(true);
      setJustCompletedToast(true);
      setTimeout(() => setJustCompletedToast(false), 3500);
    }
  };

  if (!bab) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Memuat materi...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Toast Feedback */}
      {justCompletedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <div className="text-xs sm:text-sm font-semibold">
            Bab ini berhasil ditandai selesai! Progres Anda telah disimpan.
          </div>
        </div>
      )}

      {/* Top Breadcrumb & Status */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-emerald-700 font-medium">Beranda</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link to="/materi" className="hover:text-emerald-700 font-medium">Materi</Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
            {bab.kategoriJudul}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-[200px]">
            Bab {bab.nomor}
          </span>
        </div>

        {/* Title Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Bab {bab.nomor} • {bab.kategoriJudul}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {bab.estimasiMenit || 5} Menit Baca
            </span>
            {completed && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Materi Sudah Selesai
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {bab.judul}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {bab.deskripsi}
          </p>
        </div>
      </div>

      {/* Main Educational Content Sections */}
      <div className="space-y-8">
        {bab.sections && bab.sections.map((section, idx) => (
          <article 
            key={idx} 
            className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5"
          >
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 font-extrabold text-sm flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">
                {section.subjudul}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {section.penjelasan}
            </p>

            {/* Visual Section Component (Infographic / Step-by-Step / Comparison) */}
            {section.visual && (
              <VisualSection visual={section.visual} />
            )}

            {/* Poin Penting */}
            {section.poinPenting && section.poinPenting.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Poin Penting untuk Diingat:
                </h4>
                <ul className="space-y-2">
                  {section.poinPenting.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[2.5]" />
                      </div>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips Praktis */}
            {section.tipsPraktis && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs sm:text-sm leading-relaxed">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Tips Sehat Praktis: </span>
                  <span>{section.tipsPraktis}</span>
                </div>
              </div>
            )}
          </article>
        ))}

        {/* Contoh Praktik Mandiri */}
        {bab.contohPraktik && bab.contohPraktik.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-white" />
              <h3 className="text-xl font-bold">Contoh Praktik yang Bisa Anda Coba Hari Ini</h3>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Terapkan pemahaman materi ini secara langsung dalam kehidupan harian Anda:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {bab.contohPraktik.map((contoh, cIdx) => (
                <div key={cIdx} className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 space-y-1">
                  <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                    {contoh.langkah}
                  </div>
                  <div className="text-xs sm:text-sm text-white/95 leading-relaxed">
                    {contoh.keterangan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Completion & Quiz CTA Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-emerald-500/30 shadow-md space-y-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Evaluasi Pemahaman
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Siap Menguji Pemahaman Bab Ini?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Ikuti kuis 5 soal pilihan ganda. Nilai kelulusan minimal 70 dan Anda dapat mengulang kuis tanpa batas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {!completed ? (
              <button
                onClick={handleMarkComplete}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Tandai Selesai</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Bab Selesai</span>
              </div>
            )}

            <Link
              to={`/kuis/${kategoriId}/${babId}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{quizInfo ? 'Ulangi Kuis Bab Ini' : 'Mulai Kuis 5 Soal'}</span>
            </Link>
          </div>
        </div>

        {quizInfo && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs sm:text-sm font-semibold text-emerald-900">
            <span>Riwayat Kuis Anda Sebelumnya:</span>
            <span className="font-extrabold">
              Nilai: {quizInfo.score}/100 ({quizInfo.passed ? 'Lulus' : 'Belum Lulus'})
            </span>
          </div>
        )}
      </div>

      {/* Navigation Buttons: Previous & Next Chapter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
        {prevBab ? (
          <Link
            to={`/materi/${prevBab.kategoriId}/${prevBab.id}`}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm shadow-2xs hover:border-slate-300 transition-all flex items-center justify-center gap-2.5 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Bab Sebelumnya</span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextBab ? (
          <Link
            to={`/materi/${nextBab.kategoriId}/${nextBab.id}`}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/15 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
          >
            <span>Bab Sesudahnya</span>
            <ArrowRight className="w-4 h-4 text-white shrink-0" />
          </Link>
        ) : (
          <Link
            to="/progres"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 min-h-[44px]"
          >
            <span>Lihat Rekap Progres</span>
            <ArrowRight className="w-4 h-4 text-white shrink-0" />
          </Link>
        )}
      </div>

    </div>
  );
}

