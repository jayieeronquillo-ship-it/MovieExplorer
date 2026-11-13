// All communication with the TMDB REST API lives in this file.
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const MAX_PAGES = 500; // TMDB does not serve pages beyond 500

export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'vote_average.desc', label: 'Rating' },
  { value: 'primary_release_date.desc', label: 'Release date' },
  { value: 'original_title.asc', label: 'Title (A to Z)' },
];

// Only used if the genre request itself fails, so the filter stays usable.
export const FALLBACK_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasy' },
  { id: 27, name: 'Horror' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
];

export class ApiError extends Error {
  constructor(kind, message, status) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind; // 'config' | 'network' | 'auth' | 'notfound' | 'ratelimit' | 'server' | 'unknown'
    this.status = status;
  }
}

export function imageUrl(path, size = 'w342') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

async function request(path, params = {}, signal) {
  if (!API_KEY) {
    throw new ApiError(
      'config',
      'No TMDB API key found. Add VITE_TMDB_API_KEY to your .env file and restart the dev server.'
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('network', 'Could not reach the movie service. Check your internet connection and try again.');
  }

  if (!response.ok) {
    const status = response.status;
    if (status === 401) throw new ApiError('auth', 'TMDB rejected the API key. Check the value in your .env file.', status);
    if (status === 404) throw new ApiError('notfound', 'We could not find that movie.', status);
    if (status === 429) throw new ApiError('ratelimit', 'Too many requests right now. Wait a few seconds and try again.', status);
    if (status >= 500) throw new ApiError('server', 'The movie service is temporarily unavailable. Try again shortly.', status);
    throw new ApiError('unknown', `The movie service returned an unexpected error (${status}).`, status);
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError('unknown', 'The movie service sent a response we could not read.');
  }
}

function normalizeList(data) {
  return {
    results: data.results || [],
    page: data.page || 1,
    totalPages: Math.min(data.total_pages || 0, MAX_PAGES),
    totalResults: data.total_results || 0,
  };
}

export async function discoverMovies({ page = 1, genre, sort = 'popularity.desc' } = {}, signal) {
  const params = {
    page,
    sort_by: sort,
    with_genres: genre,
    include_adult: false,
  };
  // Keep sorted lists meaningful: avoid obscure titles and unreleased films.
  if (sort === 'vote_average.desc') params['vote_count.gte'] = 300;
  if (sort === 'original_title.asc') params['vote_count.gte'] = 50;
  if (sort === 'primary_release_date.desc') {
    params['primary_release_date.lte'] = new Date().toISOString().slice(0, 10);
    params['vote_count.gte'] = 10;
  }
  return normalizeList(await request('/discover/movie', params, signal));
}

export async function searchMovies({ query, page = 1 }, signal) {
  return normalizeList(
    await request('/search/movie', { query, page, include_adult: false }, signal)
  );
}

export async function getTrendingMovies(signal) {
  return normalizeList(await request('/trending/movie/week', {}, signal));
}

export async function getNowPlayingMovies(signal) {
  return normalizeList(await request('/movie/now_playing', {}, signal));
}

export async function getTopRatedMovies(signal) {
  return normalizeList(await request('/movie/top_rated', {}, signal));
}

let genresCache = null;
export async function getGenres(signal) {
  if (genresCache) return genresCache;
  const data = await request('/genre/movie/list', {}, signal);
  genresCache = data.genres || [];
  return genresCache;
}

export async function getMovieDetails(id, signal) {
  if (!/^\d+$/.test(String(id))) {
    throw new ApiError('notfound', 'That is not a valid movie ID.', 404);
  }
  return request(`/movie/${id}`, { append_to_response: 'credits' }, signal);
}
