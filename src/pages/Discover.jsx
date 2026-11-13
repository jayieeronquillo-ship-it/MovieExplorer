import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies, useGenres } from '../hooks/useMovies.js';
import SearchBar from '../components/SearchBar.jsx';
import GenreFilter from '../components/GenreFilter.jsx';
import SortDropdown from '../components/SortDropdown.jsx';
import MovieGrid from '../components/MovieGrid.jsx';
import Pagination from '../components/Pagination.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { SearchIcon } from '../components/Icons.jsx';

const MAX_PAGE = 500;

export default function Discover() {
  const [params, setParams] = useSearchParams();

  const query = params.get('q') || '';
  const genre = params.get('genre') || '';
  const sort = params.get('sort') || '';
  const page = Math.min(MAX_PAGE, Math.max(1, parseInt(params.get('page'), 10) || 1));

  const { genres, loading: genresLoading } = useGenres();
  const { movies, totalPages, totalResults, loading, error, retry, isSearch } = useMovies({
    query,
    genre,
    sort,
    page,
  });

  // Single place that edits the URL. Changing anything but the page resets to page 1.
  const update = useCallback(
    (changes, replace = false) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(changes).forEach(([key, value]) => {
            if (value === '' || value == null || (key === 'page' && Number(value) === 1)) next.delete(key);
            else next.set(key, String(value));
          });
          if (!('page' in changes)) next.delete('page');
          return next;
        },
        { replace }
      );
    },
    [setParams]
  );

  const handleSearch = useCallback((value) => update({ q: value.trim() }, true), [update]);

  // Never stay on a page that does not exist for the current results.
  useEffect(() => {
    if (!loading && !error && totalPages > 0 && page > totalPages) update({ page: totalPages }, true);
  }, [loading, error, totalPages, page, update]);

  // Bring the results back into view when the page changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const genreName = genres.find((g) => String(g.id) === genre)?.name;
  const heading = query ? `Results for "${query}"` : genreName ? `${genreName} movies` : 'Discover movies';

  const resetFilters = () => update({ genre: '', sort: '' });

  const emptyState = (
    <div className="state">
      <SearchIcon className="state__icon" width={40} height={40} />
      {isSearch ? (
        <>
          <h2 className="state__title">No movies found for "{query}"</h2>
          <p className="state__text">
            {genre ? 'Try a different genre, check the spelling, or search for another title.' : 'Check the spelling or try a different title.'}
          </p>
          <div className="state__actions">
            <button type="button" className="btn btn--primary" onClick={() => update({ q: '', genre: '', sort: '' })}>
              Clear search
            </button>
            {genre && (
              <button type="button" className="btn btn--ghost" onClick={() => update({ q: query, genre: '', sort })}>
                Remove genre filter
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 className="state__title">No movies match these filters</h2>
          <p className="state__text">Try another genre or sorting option.</p>
          <div className="state__actions">
            <button type="button" className="btn btn--primary" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="container page">
      <header className="page__head">
        <h1>{heading}</h1>
        {!loading && !error && totalResults > 0 && (
          <p className="page__sub">{totalResults.toLocaleString('en-US')} movies found</p>
        )}
      </header>

      <div className="toolbar">
        <SearchBar
          className="search-bar--large"
          initialValue={query}
          onSubmit={handleSearch}
          live
          placeholder="Search for a movie title"
        />
        <SortDropdown value={sort} onChange={(value) => update({ sort: value })} allowRelevance={isSearch} />
      </div>

      <GenreFilter
        genres={genres}
        loading={genresLoading}
        selected={genre}
        onChange={(value) => update({ genre: value })}
      />

      {isSearch && (genre || sort) && (
        <p className="page__note">Genre filter and sorting apply to the results on this page.</p>
      )}

      {error ? (
        <ErrorMessage
          title={error.kind === 'ratelimit' ? 'Slow down a little' : 'We could not load movies'}
          message={error.message}
          onRetry={retry}
        />
      ) : (
        <>
          <MovieGrid movies={movies} loading={loading} emptyState={emptyState} />
          {!loading && movies.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => update({ page: p })} />
          )}
          {!loading && movies.length === 0 && totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onPageChange={(p) => update({ page: p })} />
          )}
        </>
      )}
    </div>
  );
}
