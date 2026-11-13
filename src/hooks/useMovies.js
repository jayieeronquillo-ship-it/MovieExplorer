import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  discoverMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
  FALLBACK_GENRES,
} from '../services/movieApi.js';

// Generic data-fetching hook: runs an async function inside useEffect,
// cancels stale requests and exposes loading / error / retry.
export function useAsync(asyncFn, deps) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    asyncFn(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setState({ data: null, loading: false, error });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}

const SORTERS = {
  'popularity.desc': (a, b) => (b.popularity || 0) - (a.popularity || 0),
  'vote_average.desc': (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
  'primary_release_date.desc': (a, b) => (b.release_date || '').localeCompare(a.release_date || ''),
  'original_title.asc': (a, b) => (a.title || '').localeCompare(b.title || ''),
};

// Search + discover in one hook. TMDB's search endpoint has no genre or sort
// options, so in search mode those are applied to the current page of results.
export function useMovies({ query = '', genre = '', sort = '', page = 1 }) {
  const trimmed = query.trim();

  const { data, loading, error, retry } = useAsync(
    (signal) =>
      trimmed
        ? searchMovies({ query: trimmed, page }, signal)
        : discoverMovies({ page, genre, sort: sort || undefined }, signal),
    [trimmed, genre, sort, page]
  );

  const movies = useMemo(() => {
    if (!data) return [];
    if (!trimmed) return data.results;
    let list = [...data.results];
    if (genre) list = list.filter((m) => (m.genre_ids || []).includes(Number(genre)));
    if (sort && SORTERS[sort]) list = list.sort(SORTERS[sort]);
    return list;
  }, [data, trimmed, genre, sort]);

  return {
    movies,
    totalPages: data?.totalPages ?? 0,
    totalResults: data?.totalResults ?? 0,
    loading,
    error,
    retry,
    isSearch: Boolean(trimmed),
  };
}

export function useMovieDetails(id) {
  return useAsync((signal) => getMovieDetails(id, signal), [id]);
}

export function useGenres() {
  const { data, loading, error } = useAsync((signal) => getGenres(signal), []);
  return { genres: data || (error ? FALLBACK_GENRES : []), loading };
}
