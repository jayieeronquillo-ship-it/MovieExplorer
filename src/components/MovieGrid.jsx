import MovieCard from './MovieCard.jsx';

function SkeletonCard() {
  return (
    <div className="movie-card movie-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--poster" />
      <div className="skeleton skeleton--line" />
      <div className="skeleton skeleton--line skeleton--short" />
    </div>
  );
}

/**
 * Renders skeletons while loading, `emptyState` when there are no movies,
 * otherwise the responsive card grid.
 */
export default function MovieGrid({ movies, loading = false, skeletonCount = 20, emptyState = null }) {
  if (loading) {
    return (
      <div className="movie-grid" role="status" aria-label="Loading movies">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!movies || movies.length === 0) return emptyState;

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
