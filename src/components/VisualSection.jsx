import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldAlert, Check } from 'lucide-react';

export default function VisualSection({ visual }) {
  if (!visual) return null;

  const { type, tag, judul, items = [] } = visual;

  if (type === 'step-by-step') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 border border-emerald-100 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white">
            {tag || 'Panduan Langkah'}
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900">{judul}</h4>
        </div>
        
        <div className="space-y-3 mt-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white border border-emerald-100/80 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="space-y-0.5">
                <h5 className="text-sm font-bold text-slate-800">{item.judul}</h5>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.deskripsi}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'comparison') {
    return (
      <div className="my-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-800 text-white">
            {tag || 'Perbandingan'}
          </span>
          <h4 className="text-base sm:text-lg font-bold text-slate-900">{judul}</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, idx) => {
            const isNegative = idx === 0 && items.length === 2 && item.judul.toLowerCase().includes('sedenter');
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border ${
                  isNegative 
                    ? 'bg-rose-50/60 border-rose-200 text-rose-900' 
                    : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                  {isNegative ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  <span>{item.judul}</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">{item.deskripsi}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: infographic cards
  return (
    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white">
          {tag || 'Visual Edukasi'}
        </span>
        <h4 className="text-base sm:text-lg font-bold text-slate-900">{judul}</h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mb-2" />
            <h5 className="text-sm font-bold text-slate-900 mb-1">{item.judul}</h5>
            <p className="text-xs text-slate-600 leading-relaxed">{item.deskripsi}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

