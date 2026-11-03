import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Award, 
  BookOpen, 
  AlertTriangle,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getBabDetail, getNextBab } from '../utils/materiData';
import { saveQuizResult, getQuizResult } from '../utils/storage';

export default function KuisPage() {
  const { kategoriId, babId } = useParams();
  const navigate = useNavigate();

  const [bab, setBab] = useState(null);
  const [nextBab, setNextBab] = useState(null);
  const [answers, setAnswers] = useState({}); // { [questionIndex]: 'A' | 'B' | 'C' | 'D' }
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const detail = getBabDetail(kategoriId, babId);
    if (!detail || !detail.kuis) {
      navigate('/materi');
      return;
    }
    setBab(detail);
    setNextBab(getNextBab(kategoriId, babId));

    // Check if there was an existing result for review or start fresh
    const existing = getQuizResult(kategoriId, babId);
    if (existing && existing.answers && existing.answers.length === 5) {
      const reconstructed = {};
      existing.answers.forEach((ans, idx) => {
        reconstructed[idx] = ans;
      });
      setAnswers(reconstructed);
      setIsSubmitted(true);
      setScoreResult(existing);
    } else {
      setAnswers({});
      setIsSubmitted(false);
      setScoreResult(null);
    }
  }, [kategoriId, babId, navigate]);

  const handleSelectOption = (qIndex, optionId) => {
    if (isSubmitted) return; // locked once submitted
    setAnswers(prev => ({
      ...prev,
      [qIndex]: optionId,
    }));
    setValidationError('');
  };

  const handleSubmitQuiz = () => {
    if (!bab || !bab.kuis) return;
    const unanswered = [];
    bab.kuis.forEach((_, idx) => {
      if (!answers[idx]) {
        unanswered.push(idx + 1);
      }
    });

    if (unanswered.length > 0) {
      setValidationError(`Mohon jawab semua soal terlebih dahulu. Soal yang belum terjawab: No. ${unanswered.join(', ')}`);
      return;
    }

    // Calculate score
    let correctCount = 0;
    const answersArray = [];

    bab.kuis.forEach((q, idx) => {
      const userChoice = answers[idx];
      answersArray.push(userChoice);
      if (userChoice === q.kunciJawaban) {
        correctCount += 1;
      }
    });

    const score = (correctCount / bab.kuis.length) * 100;
    const passed = score >= 70;

    const saved = saveQuizResult(kategoriId, babId, score, correctCount, bab.kuis.length, answersArray);
    setScoreResult(saved);
    setIsSubmitted(true);
    setValidationError('');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Confetti celebration if passed!
    if (passed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setIsSubmitted(false);
    setScoreResult(null);
    setValidationError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!bab || !bab.kuis) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Memuat soal kuis...</p>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === bab.kuis.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-emerald-700 font-medium">Beranda</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to="/materi" className="hover:text-emerald-700 font-medium">Materi</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link to={`/materi/${kategoriId}/${babId}`} className="hover:text-emerald-700 font-medium">
          Bab {bab.nomor}
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
          Kuis Bab
        </span>
      </div>

      {/* Header Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Kuis Evaluasi • Bab {bab.nomor}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            5 Soal Pilihan Ganda
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Nilai Kelulusan: 70
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Kuis: {bab.judul}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Pilihlah salah satu jawaban yang paling tepat. Urutan soal tidak diacak, tanpa batas waktu, dan Anda dapat mengulang kuis kapan saja.
        </p>

        {/* Answered progress bar while taking quiz */}
        {!isSubmitted && (
          <div className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Progres Pengerjaan</span>
              <span className="font-bold text-emerald-700">{answeredCount} dari {bab.kuis.length} Soal</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-200"
                style={{ width: `${(answeredCount / bab.kuis.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Score Result Card (when submitted) */}
      {isSubmitted && scoreResult && (
        <div 
          className={`p-6 sm:p-8 rounded-3xl border-2 shadow-lg space-y-6 text-center animate-in fade-in zoom-in-95 duration-200 ${
            scoreResult.passed 
              ? 'bg-gradient-to-b from-emerald-50 via-white to-emerald-50/40 border-emerald-500 text-emerald-950' 
              : 'bg-gradient-to-b from-amber-50 via-white to-amber-50/40 border-amber-400 text-amber-950'
          }`}
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mx-auto bg-white shadow-2xs border">
            {scoreResult.passed ? (
              <>
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Selamat! Anda Dinyatakan Lulus</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-amber-700">Belum Lulus (Minimal Nilai 70)</span>
              </>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-5xl sm:text-6xl font-black tracking-tight">
              {scoreResult.score}
              <span className="text-2xl sm:text-3xl font-bold text-slate-400"> / 100</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Benar {scoreResult.correctCount} dari {bab.kuis.length} Soal
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {scoreResult.passed
              ? 'Luar biasa! Anda telah memahami materi ini dengan sangat baik. Riwayat kelulusan bab ini telah disimpan di browser Anda.'
              : 'Jangan berkecil hati! Anda dapat meninjau pembahasan jawaban di bawah ini dan mengulang kuis tanpa batas.'}
          </p>

          {/* Action buttons on Result */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 w-full max-w-lg mx-auto sm:max-w-none">
            <button
              onClick={handleRetakeQuiz}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm shadow-2xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ulangi Kuis</span>
            </button>

            <Link
              to={`/materi/${kategoriId}/${babId}`}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <BookOpen className="w-4 h-4 text-slate-600 shrink-0" />
              <span>Baca Ulang Materi</span>
            </Link>

            {nextBab ? (
              <Link
                to={`/materi/${nextBab.kategoriId}/${nextBab.id}`}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Bab Sesudahnya</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            ) : (
              <Link
                to="/progres"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <span>Lihat Progres Lengkap</span>
                <Award className="w-4 h-4 shrink-0" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Validation alert */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {bab.kuis.map((q, qIdx) => {
          const userChoice = answers[qIdx];
          const isCorrect = userChoice === q.kunciJawaban;

          return (
            <div
              key={q.id}
              className={`p-6 sm:p-7 rounded-3xl bg-white border transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 ring-1 ring-emerald-200'
                    : 'border-rose-300 ring-1 ring-rose-200'
                  : 'border-slate-200 shadow-2xs hover:border-slate-300'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                    {qIdx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Soal {qIdx + 1} dari {bab.kuis.length}
                  </span>
                </div>

                {isSubmitted && (
                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isCorrect 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Jawaban Benar (+20)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Jawaban Salah (0)
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Question Text */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-5">
                {q.pertanyaan}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {q.pilihan.map((opt) => {
                  const isSelected = userChoice === opt.id;
                  const isOfficialCorrect = q.kunciJawaban === opt.id;

                  let optionClass = 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-200';

                  if (isSubmitted) {
                    if (isOfficialCorrect) {
                      optionClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'bg-rose-50 border-rose-400 text-rose-950 line-through';
                    } else {
                      optionClass = 'bg-slate-50/40 border-slate-200 text-slate-400';
                    }
                  } else if (isSelected) {
                    optionClass = 'bg-emerald-50 border-emerald-600 text-emerald-900 font-semibold shadow-xs';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(qIdx, opt.id)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${optionClass}`}
                    >
                      <div className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 ${
                        isSubmitted && isOfficialCorrect
                          ? 'bg-emerald-600 text-white'
                          : isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-slate-300 text-slate-600'
                      }`}>
                        {opt.id}
                      </div>
                      <span className="leading-relaxed grow">{opt.teks}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Pembahasan) shown after submit */}
              {isSubmitted && q.pembahasan && (
                <div className="mt-5 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Pembahasan Jawaban:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    <strong className="text-emerald-800">Kunci Benar: {q.kunciJawaban}. </strong>
                    {q.pembahasan}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      {!isSubmitted && (
        <div className="sticky bottom-4 sm:bottom-6 z-20 p-3.5 sm:p-5 rounded-2xl bg-white/98 backdrop-blur-md border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
            <span>Terjawab: </span>
            <strong className="text-emerald-700">{answeredCount} dari {bab.kuis.length}</strong>
            {!isAllAnswered && (
              <span className="text-slate-400 block sm:inline sm:ml-2">
                (Jawab semua soal untuk melihat nilai)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              to={`/materi/${kategoriId}/${babId}`}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm text-center min-h-[44px] flex items-center justify-center"
            >
              Kembali ke Materi
            </Link>

            <button
              onClick={handleSubmitQuiz}
              disabled={!isAllAnswered}
              className={`w-1/2 sm:w-auto px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md min-h-[44px] flex items-center justify-center ${
                isAllAnswered
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-[1.02]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Kirim Jawaban
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation when Submitted */}
      {isSubmitted && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
          <button
            onClick={handleRetakeQuiz}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 font-bold text-xs sm:text-sm text-slate-700 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <span>Ulangi Kuis Bab Ini</span>
          </button>

          <Link
            to="/progres"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" />
            <span>Lihat Halaman Progres</span>
          </Link>
        </div>
      )}

    </div>
  );
}

