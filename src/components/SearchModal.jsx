import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, ChevronRight, Tag, ArrowRight } from 'lucide-react';
import { searchMateri } from '../utils/materiData';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const suggestions = [
    'Peregangan',
    'FITT',
    'Plank',
    'Kardio',
    'Dehidrasi',
    'Cedera',
    'Nadi',
    'Talk Test'
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const res = searchMateri(query);
      setResults(res);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  const handleSelectBab = (kategoriId, babId) => {
    onClose();
    navigate(`/materi/${kategoriId}/${babId}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex justify-center items-start">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik topik materi, misal: peregangan, kardio, FITT..."
            className="w-full text-base sm:text-lg bg-transparent border-0 focus:outline-hidden text-slate-800 placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 min-h-[36px] flex items-center justify-center shrink-0"
            aria-label="Tutup Pencarian"
          >
            <span className="hidden sm:inline">ESC</span>
            <span className="sm:hidden">Tutup</span>
          </button>
        </div>

        {/* Suggestion Tags */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-medium text-slate-500 flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3" /> Topik Populer:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => setQuery(item)}
                className="text-xs px-2.5 py-1 rounded-full bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-slate-200 text-slate-600 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-2">
          {query.trim().length < 2 ? (
            <div className="py-8 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm">Ketik minimal 2 huruf untuk menemukan materi kesehatan & kebugaran.</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Ditemukan {results.length} Materi Terkait
              </div>
              {results.map((item) => (
                <div
                  key={`${item.kategoriId}-${item.id}`}
                  onClick={() => handleSelectBab(item.kategoriId, item.id)}
                  className="group p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 cursor-pointer transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        {item.kategoriJudul}
                      </span>
                      <span className="text-xs text-slate-500">Bab {item.nomor}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700">
                      {item.judul}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {item.deskripsi}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-slate-500 space-y-2">
              <p className="text-sm font-medium">Tidak ada materi yang cocok dengan kata kunci "{query}"</p>
              <p className="text-xs text-slate-400">Cobalah kata kunci lain seperti: kardio, pemanasan, otot, atau FITT.</p>
            </div>
          )}
        </div>

        {/* Modal Footer Quick Action */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Gunakan tombol panah atau klik untuk memilih materi</span>
          <button
            onClick={() => {
              onClose();
              navigate('/materi');
            }}
            className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
          >
            Lihat Semua Modul <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}

