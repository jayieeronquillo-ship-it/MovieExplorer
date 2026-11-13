import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'movie-explorer:favorites';
const FavoritesContext = createContext(null);

// Keep only what the cards need so localStorage stays small.
const pickMovie = (m) => ({
  id: m.id,
  title: m.title,
  poster_path: m.poster_path ?? null,
  release_date: m.release_date || '',
  vote_average: m.vote_average || 0,
  overview: m.overview || '',
});

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage may be full or blocked; favorites still work for this session.
    }
  }, [favorites]);

  const isFavorite = useCallback((id) => favorites.some((m) => m.id === id), [favorites]);

  const addFavorite = useCallback((movie) => {
    setFavorites((prev) => (prev.some((m) => m.id === movie.id) ? prev : [pickMovie(movie), ...prev]));
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [pickMovie(movie), ...prev]
    );
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo(
    () => ({ favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}
