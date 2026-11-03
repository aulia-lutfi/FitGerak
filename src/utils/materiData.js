import kategoriData from '../data/kategori.json';
import kebugaranData from '../data/kebugaran.json';
import latihanData from '../data/latihan-10-menit.json';
import penjasData from '../data/materi-penjas.json';

const categoryMap = {
  'kebugaran': kebugaranData,
  'latihan-10-menit': latihanData,
  'materi-penjas': penjasData,
};

export const getAllCategories = () => {
  return kategoriData.map(cat => {
    const detail = categoryMap[cat.id] || { babList: [] };
    return {
      ...cat,
      babList: detail.babList,
      totalBab: detail.babList.length,
    };
  });
};

export const getCategoryById = (kategoriId) => {
  const cat = kategoriData.find(c => c.id === kategoriId);
  if (!cat) return null;
  const detail = categoryMap[kategoriId] || { babList: [] };
  return {
    ...cat,
    babList: detail.babList,
    totalBab: detail.babList.length,
  };
};

export const getBabDetail = (kategoriId, babId) => {
  const detail = categoryMap[kategoriId];
  if (!detail) return null;
  const bab = detail.babList.find(b => b.id === babId);
  if (!bab) return null;
  const categoryMeta = kategoriData.find(c => c.id === kategoriId);
  return {
    ...bab,
    kategoriId,
    kategoriJudul: categoryMeta ? categoryMeta.judul : detail.kategoriJudul,
    kategoriBadge: categoryMeta?.badge || '',
  };
};

export const getAllBabsFlat = () => {
  const list = [];
  getAllCategories().forEach(cat => {
    cat.babList.forEach(bab => {
      list.push({
        kategoriId: cat.id,
        kategoriJudul: cat.judul,
        kategoriBadge: cat.badge,
        kategoriWarna: cat.warna,
        ...bab,
      });
    });
  });
  return list;
};

export const getNextBab = (kategoriId, babId) => {
  const all = getAllBabsFlat();
  const currentIndex = all.findIndex(b => b.kategoriId === kategoriId && b.id === babId);
  if (currentIndex === -1 || currentIndex === all.length - 1) {
    return null;
  }
  return all[currentIndex + 1];
};

export const getPreviousBab = (kategoriId, babId) => {
  const all = getAllBabsFlat();
  const currentIndex = all.findIndex(b => b.kategoriId === kategoriId && b.id === babId);
  if (currentIndex <= 0) {
    return null;
  }
  return all[currentIndex - 1];
};

export const searchMateri = (rawQuery) => {
  if (!rawQuery || typeof rawQuery !== 'string') return [];
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const results = [];
  const allBabs = getAllBabsFlat();

  allBabs.forEach(bab => {
    let score = 0;
    const matches = [];

    // Title match
    if (bab.judul.toLowerCase().includes(query)) {
      score += 10;
      matches.push('Judul Bab');
    }
    // Category match
    if (bab.kategoriJudul.toLowerCase().includes(query)) {
      score += 5;
      matches.push('Kategori');
    }
    // Description match
    if (bab.deskripsi && bab.deskripsi.toLowerCase().includes(query)) {
      score += 4;
      matches.push('Ringkasan');
    }
    // Sections content match
    if (bab.sections) {
      bab.sections.forEach(sec => {
        if (sec.subjudul && sec.subjudul.toLowerCase().includes(query)) {
          score += 4;
          matches.push(`Submateri: ${sec.subjudul}`);
        }
        if (sec.penjelasan && sec.penjelasan.toLowerCase().includes(query)) {
          score += 2;
        }
        if (sec.poinPenting && sec.poinPenting.some(p => p.toLowerCase().includes(query))) {
          score += 2;
        }
      });
    }

    if (score > 0) {
      results.push({
        bab,
        score,
        matchedIn: matches.slice(0, 2).join(', ') || 'Isi Materi',
      });
    }
  });

  return results.sort((a, b) => b.score - a.score).map(r => r.bab);
};

