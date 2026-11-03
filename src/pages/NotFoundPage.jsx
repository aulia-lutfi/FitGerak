import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, BookOpen } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 sm:py-32 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
        <Activity className="w-8 h-8 stroke-[2.2]" />
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          Materi atau tautan yang Anda tuju mungkin telah dipindahkan atau belum tersedia.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <Link
          to="/materi"
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Daftar Materi</span>
        </Link>
      </div>
    </div>
  );
}

