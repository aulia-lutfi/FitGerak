import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, ShieldCheck, Zap, BookOpen, Users } from 'lucide-react';

export default function Footer() {
  const timPencipta = [
    { nama: 'Raja Aufa', nim: '24110136' },
    { nama: 'Maulizar Syauqi', nim: '24110110' },
    { nama: 'Haikal', nim: '24110105' },
    { nama: 'Muazzir', nim: '24110086' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          
          {/* Col 1: Brand & Misi */}
          <div className="space-y-4">
            <Link to="/" className="inline-block bg-white px-3 py-1.5 rounded-2xl shadow-xs">
              <img 
                src="/logo-fitgerak.png" 
                alt="FitGerak - Hidup Sehat & Bugar" 
                className="h-9 w-auto object-contain"
              />
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Platform edukasi kebugaran jasmani dan panduan pola hidup sehat berbasis ilmu pengetahuan. Dirancang agar masyarakat dapat bergerak aktif secara mandiri tanpa login.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tanpa Login</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>HP & Komputer</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Topik Belajar</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link to="/materi" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Kebugaran Jasmani
                </Link>
              </li>
              <li>
                <Link to="/materi" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Latihan 10 Menit di Rumah
                </Link>
              </li>
              <li>
                <Link to="/materi" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Materi Pendidikan Jasmani
                </Link>
              </li>
              <li>
                <Link to="/progres" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Pantau Progres & Kuis
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dukungan Mitra Abulyatama */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Mitra Edukasi</h4>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <img 
                src="/logo-abulyatama.png" 
                alt="Logo Universitas Abulyatama" 
                className="h-10 w-auto object-contain bg-white/10 p-1 rounded-lg shrink-0"
              />
              <div className="text-xs text-slate-300">
                <strong className="block text-white font-bold leading-tight">Universitas Abulyatama</strong>
                <span className="text-[11px] text-slate-400">Pendidikan Jasmani</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Program edukasi kesehatan kebugaran jasmani berkolaborasi dengan kurikulum penjas dan pengabdian masyarakat.
            </p>
          </div>

          {/* Col 4: Tim Pencipta */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Tim Pencipta</span>
            </h4>

            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 text-xs">
              {timPencipta.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-200">
                  <span className="font-semibold">{idx + 1}. {item.nama}</span>
                  <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/60">
                    {item.nim}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              Inisiator & Pengembang Platform FitGerak
            </p>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} FitGerak • Dikembangkan oleh Tim Mahasiswa Universitas Abulyatama.</p>
          <div className="flex items-center justify-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" />
            <span>untuk masyarakat sehat & bugar</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
