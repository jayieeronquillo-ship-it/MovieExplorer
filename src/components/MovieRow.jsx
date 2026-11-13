import MovieCard from './MovieCard.jsx';
import ErrorMessage from './ErrorMessage.jsx';

export default function MovieRow({ title, subtitle, movies, loading, error, onRetry }) {
  return (
    <section className="section container">
      <div className="section__head">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {error ? (
        <ErrorMessage title="Could not load this list" message={error.message} onRetry={error.kind === 'notfound' ? undefined : onRetry} />
      ) : (
        <div className="movie-row" role={loading ? 'status' : undefined} aria-label={loading ? `Loading ${title}` : undefined}>
          {loading
            ? Array.from({ length: 8 }, (_, i) => (
                <div className="movie-row__item" key={i}>
                  <div className="movie-card movie-card--skeleton" aria-hidden="true">
                    <div className="skeleton skeleton--poster" />
                    <div className="skeleton skeleton--line" />
                    <div className="skeleton skeleton--line skeleton--short" />
                  </div>
                </div>
              ))
            : (movies || []).slice(0, 16).map((movie) => (
                <div className="movie-row__item" key={movie.id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
        </div>
      )}
    </section>
  );
}
