import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Timer, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  PlayCircle, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Award,
  Sparkles,
  Flame,
  Check,
  Clock,
  Droplets,
  Footprints
} from 'lucide-react';
import { getAllCategories } from '../utils/materiData';
import { getProgress } from '../utils/storage';

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [progress, setProgress] = useState({ completedBabs: [], lastActive: null });
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  const tipsHarian = [
    {
      judul: 'Aturan 20-20-20 Saat Duduk Bekerja',
      konten: 'Setiap 20 menit bekerja di depan layar, tataplah objek sejauh 20 kaki (6 meter) selama 20 detik, dan regangkan otot leher Anda.',
      icon: Clock
    },
    {
      judul: 'Gelas Air Pertama Setelah Bangun',
      konten: 'Minum 300-500 ml air putih hangat segera setelah bangun tidur melancarkan aliran darah dan merehidrasi organ dalam.',
      icon: Droplets
    },
    {
      judul: 'Aktifkan Langkah Kaki Harian',
      konten: 'Coba parkir kendaraan sedikit lebih jauh atau gunakan tangga untuk mencapai target 5.000 langkah harian pertama Anda.',
      icon: Footprints
    }
  ];

  useEffect(() => {
    setCategories(getAllCategories());
    const currentProgress = getProgress();
    setProgress(currentProgress);

    const handleUpdate = () => {
      setProgress(getProgress());
    };
    window.addEventListener('fitgerak-progress-updated', handleUpdate);
    return () => window.removeEventListener('fitgerak-progress-updated', handleUpdate);
  }, []);

  const totalBabs = categories.reduce((acc, cat) => acc + (cat.babList?.length || 0), 0);
  const completedCount = progress.completedBabs?.length || 0;
  const overallPercent = totalBabs > 0 ? Math.round((completedCount / totalBabs) * 100) : 0;

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'HeartPulse': return HeartPulse;
      case 'Timer': return Timer;
      case 'GraduationCap': return GraduationCap;
      default: return BookOpen;
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-emerald-100/60">
        {/* Subtle decorative background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-teal-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold shadow-2xs animate-in fade-in slide-in-from-bottom duration-300">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Platform Edukasi Kebugaran Bebas Akses & Tanpa Login</span>
          </div>

          {/* Main Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.15]">
            Tubuh lebih bugar, hidup lebih segar<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 block mt-1 sm:mt-0">
              Awali dengan langkah paling<br className="hidden sm:block" /> mendasar.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed px-2">
            Pelajari konsep kebugaran jasmani, rutinitas latihan 10 menit tanpa alat di rumah, dan materi pendidikan jasmani terstruktur yang dilengkapi kuis interaktif berbobot.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2 max-w-md sm:max-w-none mx-auto w-full">
            <Link
              to="/materi"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[44px]"
            >
              <PlayCircle className="w-5 h-5 shrink-0" />
              <span>Mulai Belajar Sekarang</span>
            </Link>

            <Link
              to="/progres"
              className="w-full sm:w-auto px-6 sm:px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-700 border border-slate-300 font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-2xs min-h-[44px]"
            >
              <Award className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Lihat Progres ({completedCount}/{totalBabs})</span>
            </Link>
          </div>

          {/* Key Trust Highlights */}
          <div className="pt-6 sm:pt-8 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto text-xs sm:text-sm text-slate-600">
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs flex items-center justify-center gap-1.5 sm:gap-2 text-center">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">100% Bhs Indonesia</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs flex items-center justify-center gap-1.5 sm:gap-2 text-center">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Tanpa Login</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs flex items-center justify-center gap-1.5 sm:gap-2 text-center">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Kuis & Pembahasan</span>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs flex items-center justify-center gap-1.5 sm:gap-2 text-center">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">HP, Tablet & PC</span>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">

        {/* Resume Last Session Banner (if available) */}
        {progress.lastActive && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">
                  Lanjutkan Sesi Belajar Terakhir
                </span>
                <h3 className="text-base sm:text-lg font-bold">
                  {progress.lastActive.title || 'Materi Kebugaran'}
                </h3>
              </div>
            </div>

            <Link
              to={`/materi/${progress.lastActive.kategoriId}/${progress.lastActive.babId}`}
              className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 font-bold text-sm transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <span>Lanjut Baca</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Section: 3 Topik Belajar Utama */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                Kurikulum Terstruktur
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                3 Kategori Belajar Utama
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Pilih topik di bawah ini dan ikuti setiap bab secara berurutan.
              </p>
            </div>

            <Link
              to="/materi"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group self-start sm:self-end"
            >
              <span>Semua Modul & Bab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.icon);
              const completedInCat = cat.babList.filter(b => 
                progress.completedBabs?.includes(`${cat.id}:${b.id}`)
              ).length;
              const catPercent = Math.round((completedInCat / (cat.totalBab || 1)) * 100);

              return (
                <div
                  key={cat.id}
                  className="group bg-white rounded-3xl border border-slate-200 hover:border-emerald-400 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:shadow-emerald-600/10 transition-all duration-300 ease-out hover:-translate-y-2 flex flex-col justify-between cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-2 transition-all duration-300 shadow-2xs">
                        <IconComponent className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {cat.judul}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2">
                        {cat.deskripsi}
                      </p>
                    </div>

                    {/* Progress Bar per Category */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Penyelesaian</span>
                        <span className="font-bold text-slate-700">{completedInCat}/{cat.totalBab} Bab ({catPercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${catPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      {cat.totalBab} Bab • Ada Kuis
                    </span>
                    <Link
                      to={`/materi/${cat.id}/${cat.babList[0]?.id || 'bab-1'}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-2xs group-hover:shadow-md"
                    >
                      <span>Mulai Bab 1</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Interactive Daily Health Tip */}
        <section className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-xs">
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-200/60 text-emerald-800 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Inspirasi Gerak Hari Ini</span>
            </div>

            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
                {React.createElement(tipsHarian[activeTipIndex].icon, { className: "w-7 h-7 stroke-[2.2]" })}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {tipsHarian[activeTipIndex].judul}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
                {tipsHarian[activeTipIndex].konten}
              </p>
            </div>

            {/* Tip Switcher Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {tipsHarian.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTipIndex(i)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeTipIndex === i 
                      ? 'bg-emerald-600 w-7' 
                      : 'bg-emerald-200 hover:bg-emerald-300'
                  }`}
                  aria-label={`Tips ${i + 1}`}
                />
              ))}
            </div>

          </div>
        </section>

        {/* Section: Cara Belajar di FitGerak */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Alur Belajar yang Menyenangkan
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Cukup 4 langkah mudah untuk membangun kebiasaan hidup sehat mandiri.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-slate-900">Pilih Kategori</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tersedia topik kebugaran jasmani, latihan kilat 10 menit tanpa alat, atau materi penjas komprehensif.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 font-extrabold text-lg flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-slate-900">Pahami Penjelasan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap materi dilengkapi penjelasan sederhana, visual edukatif, serta contoh penerapan konkret.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-extrabold text-lg flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-slate-900">Ikuti Kuis 5 Soal</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uji pemahaman dengan 5 soal pilihan ganda. Nilai langsung muncul lengkap beserta pembahasan ilmiah.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-extrabold text-lg flex items-center justify-center">
                4
              </div>
              <h4 className="font-bold text-slate-900">Pantau Progres</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Status bab dan nilai kuis disimpan di browser Anda (localStorage). Anda bisa mengulang kuis tanpa batas!
              </p>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}

