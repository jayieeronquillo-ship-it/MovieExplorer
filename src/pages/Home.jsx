import { Link } from 'react-router-dom';
import { useAsync, useGenres } from '../hooks/useMovies.js';
import {
  getTrendingMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  imageUrl,
} from '../services/movieApi.js';
import { useFavorites } from '../context/FavoritesContext.jsx';
import MovieRow from '../components/MovieRow.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { HeartIcon, StarIcon } from '../components/Icons.jsx';

function Hero({ movie, loading, error, onRetry }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  if (error) {
    return (
      <section className="container hero-error">
        <ErrorMessage title="Could not load featured movies" message={error.message} onRetry={onRetry} />
      </section>
    );
  }

  if (loading || !movie) {
    return <section className="hero hero--skeleton skeleton" aria-label="Loading featured movie" role="status" />;
  }

  const backdrop = imageUrl(movie.backdrop_path, 'w1280');
  const favorite = isFavorite(movie.id);

  return (
    <section className="hero">
      <div
        className="hero__backdrop"
        style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined}
        aria-hidden="true"
      />
      <div className="container hero__content">
        <p className="hero__kicker">
          <StarIcon width={14} height={14} />
          {movie.vote_average.toFixed(1)} rating, trending this week
        </p>
        <h1 className="hero__title">{movie.title}</h1>
        <p className="hero__overview">{movie.overview}</p>
        <div className="hero__actions">
          <Link to={`/movie/${movie.id}`} className="btn btn--primary">
            View details
          </Link>
          <button
            type="button"
            className={`btn ${favorite ? 'btn--saved' : 'btn--ghost'}`}
            onClick={() => toggleFavorite(movie)}
            aria-pressed={favorite}
          >
            <HeartIcon filled={favorite} width={18} height={18} />
            {favorite ? 'Saved to Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const trending = useAsync((signal) => getTrendingMovies(signal), []);
  const nowPlaying = useAsync((signal) => getNowPlayingMovies(signal), []);
  const topRated = useAsync((signal) => getTopRatedMovies(signal), []);
  const { genres } = useGenres();

  const featured = trending.data?.results.find((m) => m.backdrop_path && m.overview);

  return (
    <>
      <Hero movie={featured} loading={trending.loading} error={trending.error} onRetry={trending.retry} />

      <MovieRow
        title="Trending this week"
        subtitle="What everyone is watching right now"
        movies={trending.data?.results}
        loading={trending.loading}
        error={trending.error}
        onRetry={trending.retry}
      />
      <MovieRow
        title="Now playing"
        subtitle="Currently in theaters"
        movies={nowPlaying.data?.results}
        loading={nowPlaying.loading}
        error={nowPlaying.error}
        onRetry={nowPlaying.retry}
      />
      <MovieRow
        title="Top rated"
        subtitle="The highest-rated movies of all time"
        movies={topRated.data?.results}
        loading={topRated.loading}
        error={topRated.error}
        onRetry={topRated.retry}
      />

      {genres.length > 0 && (
        <section className="section container">
          <div className="section__head">
            <h2>Browse by genre</h2>
          </div>
          <div className="genre-links">
            {genres.map((g) => (
              <Link key={g.id} to={`/discover?genre=${g.id}`} className="genre-links__item">
                {g.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
