const STORAGE_KEY = 'fitgerak_user_progress_v1';

const defaultState = {
  completedBabs: [], // array of "kategoriId:babId"
  quizResults: {},   // map of "kategoriId:babId" -> { score, passed, correctCount, totalCount, timestamp, answers: [] }
  lastActive: null,  // { kategoriId, babId, title, timestamp }
};

export const getProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultState };
    const parsed = JSON.parse(raw);
    return {
      completedBabs: Array.isArray(parsed.completedBabs) ? parsed.completedBabs : [],
      quizResults: parsed.quizResults && typeof parsed.quizResults === 'object' ? parsed.quizResults : {},
      lastActive: parsed.lastActive || null,
    };
  } catch (err) {
    console.error('Failed reading FitGerak progress from localStorage', err);
    return { ...defaultState };
  }
};

const notifyUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('fitgerak-progress-updated'));
  }
};

export const isBabCompleted = (kategoriId, babId) => {
  const progress = getProgress();
  const key = `${kategoriId}:${babId}`;
  return progress.completedBabs.includes(key);
};

export const markBabCompleted = (kategoriId, babId, babTitle = '') => {
  const progress = getProgress();
  const key = `${kategoriId}:${babId}`;
  if (!progress.completedBabs.includes(key)) {
    progress.completedBabs.push(key);
  }
  progress.lastActive = {
    kategoriId,
    babId,
    title: babTitle,
    timestamp: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    notifyUpdate();
  } catch (err) {
    console.error('Failed saving completed bab', err);
  }
};

export const saveQuizResult = (kategoriId, babId, score, correctCount, totalCount = 5, answers = []) => {
  const progress = getProgress();
  const key = `${kategoriId}:${babId}`;
  const passed = score >= 70;

  progress.quizResults[key] = {
    kategoriId,
    babId,
    score,
    passed,
    correctCount,
    totalCount,
    answers,
    timestamp: new Date().toISOString(),
  };

  // If passed (score >= 70), automatically mark the bab as completed as well
  if (passed && !progress.completedBabs.includes(key)) {
    progress.completedBabs.push(key);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    notifyUpdate();
  } catch (err) {
    console.error('Failed saving quiz result', err);
  }

  return progress.quizResults[key];
};

export const getQuizResult = (kategoriId, babId) => {
  const progress = getProgress();
  const key = `${kategoriId}:${babId}`;
  return progress.quizResults[key] || null;
};

export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyUpdate();
  } catch (err) {
    console.error('Failed resetting progress', err);
  }
};

